import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { settings } from '../../../../settings';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refreshToken || null,
      ]),
      secretOrKey: settings.JWT_SECRET_REFRESH,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, deviceId: payload.deviceId };
  }
}