import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { settings } from '../../../settings';
import { RefreshTokenModel } from '../domain/refresh-token.entity';
import { RefreshTokenRepositories } from '../infrastructure/refresh-token.repositiry';
import { add } from 'date-fns';
import { PasswordHelper } from './helpers/password.helper';
import { CustomHttpException, DomainExceptionCode } from '../../../core/exceptions/domain.exception';
import { RefreshTokenDto } from '../../../core/dto/refresh-token.dto';

@Injectable()
export class JwtService {
  constructor(private readonly refreshTokenRepositories: RefreshTokenRepositories) {}

  async createAccessToken(userId: string) {
    const token: string = jwt.sign({ userId }, settings.JWT_SECRET, { expiresIn: '10s' });
    return {
      accessToken: token,
    };
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    }catch (error) {
      return null;
    }
  }

  async createRefreshToken(userId: string, deviceId: string) {
    const jti: string = await PasswordHelper.generateRandomBytes();
    const hashJti: string = await PasswordHelper.hashPassword(jti);
    const refreshToken: string = jwt.sign({ userId, jti, deviceId }, settings.JWT_SECRET_REFRESH, { expiresIn: '20s' });
    const saveToken: RefreshTokenModel = RefreshTokenModel.createInstance({
      userId: userId,
      jtiHash: hashJti,
      deviceId,
      expiresAt: add(new Date(), { minutes: 20 }).toISOString(),
    });

    await this.refreshTokenRepositories.saveRefreshToken(saveToken);

    return refreshToken;
  }

  async verifyTokens(token: string) {
    try {
      const decoded: RefreshTokenDto = jwt.verify(token, settings.JWT_SECRET_REFRESH) as RefreshTokenDto;

      const tokenInDb = await this.refreshTokenRepositories.findTokenByDevice(decoded.userId, decoded.deviceId);
      if (!tokenInDb) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

      return decoded;
    } catch(e) {
      return null;
    }
  }

  async findToken(userId: string, deviceId: string, jti: string): Promise<RefreshTokenModel | null> {
    const session: RefreshTokenModel | null = await this.refreshTokenRepositories.findTokenByDevice(userId, deviceId);
    if (!session) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const isValid: boolean = await PasswordHelper.comparePassword(jti, session.jtiHash);
    if (!isValid) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    return session;
  }

  async updateRefreshToken(userId: string, deviceId: string): Promise<string> {
    const jti: string = await PasswordHelper.generateRandomBytes();
    const hashJti: string = await PasswordHelper.hashPassword(jti);
    const refreshToken: string = jwt.sign({ userId, deviceId, jti }, settings.JWT_SECRET_REFRESH, { expiresIn: '20s' });
    const decoded: { exp: number } = jwt.decode(refreshToken) as { exp: number };

    await this.refreshTokenRepositories.updateRefreshToken(userId, deviceId, hashJti, decoded.exp);

    return refreshToken;
  }
}
