import { RefreshTokenRepositories } from '../infrastructure/refresh-token.repositiry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenRepositories: RefreshTokenRepositories) {}

  async deleteSessionByDevice(userId: string, deviceId: string): Promise<boolean> {
    return await this.refreshTokenRepositories.deleteSessionByDevice(userId, deviceId);
  }
}
