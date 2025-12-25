import { Injectable } from '@nestjs/common';
import { RefreshTokenModel } from '../domain/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepositories {
  constructor(
    @InjectRepository(RefreshTokenModel)
    private readonly refreshTokenRepositories: Repository<RefreshTokenModel>,
  ) {}

  async saveRefreshToken(dto: RefreshTokenModel): Promise<boolean> {
    const token: RefreshTokenModel = this.refreshTokenRepositories.create(dto);
    await this.refreshTokenRepositories.save(token);
    return true;
  }

  async findTokenByDevice(userId: string, deviceId: string): Promise<RefreshTokenModel | null> {
    return await this.refreshTokenRepositories.findOne({
      where: { userId, deviceId },
    });
  }

  async deleteSessionByDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.refreshTokenRepositories.delete({
      userId,
      deviceId,
    });

    return result.affected === 1;
  }

  async updateRefreshToken(userId: string, deviceId: string, hashJti: string, exp: number): Promise<boolean> {
    const result = await this.refreshTokenRepositories.update(
      { userId, deviceId },
      {
        jtiHash: hashJti,
        expiresAt: new Date(exp * 1000).toISOString(),
      },
    );

    return result.affected === 1;
  }

  async deleteAllTokensExceptCurrent(userId: string, currentDeviceId: string): Promise<number> {
    const result = await this.refreshTokenRepositories.delete({
      userId,
      deviceId: Not(currentDeviceId),
    });

    return result.affected ?? 0;
  }
}
