import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../domain/refresh-token.entity';

@Injectable()
export class RefreshTokenRepositories {
  constructor(@InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>) {}

  async saveRefreshToken(dto: RefreshTokenDocument): Promise<boolean> {
    const saveRefreshToken: RefreshTokenDocument = new this.refreshTokenModel(dto);
    await saveRefreshToken.save();
    return true;
  }

  async findTokenByDevice(userId: string, deviceId: string): Promise<RefreshTokenDocument | null> {
    return await this.refreshTokenModel.findOne({ userId, deviceId });
  }

  async deleteSessionByDevice(userId: string, deviceId: string): Promise<boolean> {
    const result: DeleteResult = await this.refreshTokenModel.deleteOne({ userId, deviceId });
    return result.deletedCount === 1;
  }

  async updateRefreshToken(userId: string, deviceId: string, hashJti: string, exp: number): Promise<boolean>  {
    const result = await this.refreshTokenModel.updateOne(
      { userId, deviceId },
      { $set: { jtiHash: hashJti, expiresAt: new Date(exp * 1000) } },
      { upsert: false }
    );
    return result.matchedCount === 1;
  }

  async deleteAllTokensExceptCurrent(userId: string, currentDeviceId: string): Promise<number>  {
    const result: DeleteResult = await this.refreshTokenModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
    return result.deletedCount;
  }
}
