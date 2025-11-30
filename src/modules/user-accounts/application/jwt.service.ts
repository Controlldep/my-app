import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { settings } from '../../../settings';

@Injectable()
export class JwtService {
  async createAccessToken(userId: string) {
    const token: string = jwt.sign({userId} , settings.JWT_SECRET , {expiresIn: '10m'});
    return {
      accessToken: token,
    }
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token , settings.JWT_SECRET);
      return result.userId;
    }catch (error) {
      return null;
    }
  }
}

