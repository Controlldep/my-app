import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/session.entity';

@Injectable()
export class SessionRepositories {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async createSession(dto: SessionDocument): Promise<boolean> {
    const session: SessionDocument = new this.sessionModel(dto);
    await session.save();
    return true;
  }

  async findSessionByDeviceId(deviceId: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findOne({ deviceId });
  }

  async updateLastActiveDate(userId: string, deviceId: string, exp: number): Promise<boolean> {
    const result = await this.sessionModel.updateOne(
      {userId, deviceId},
      {
        $set: {
          lastActiveDate: new Date().toISOString(),
          expirationDate: new Date(exp * 1000).toISOString(),
        },
      }
    );
    return result.matchedCount === 1;
  }

  async getAllSessionsByUser(userId: string) {
    const findSessions: SessionDocument[] = await this.sessionModel.find({userId: userId})

    return findSessions;
  }

  async deleteAllSessionsByUserExceptCurrent(userId: string, currentDeviceId: string): Promise<boolean> {
    const result = await this.sessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId }
    });
    return result.deletedCount > 0;
  }

  async deleteSessionByDevice(userId: string, deviceId: string): Promise<boolean> {
    const deleteSession = await this.sessionModel.deleteOne({userId: userId , deviceId: deviceId})

    return deleteSession.deletedCount > 0;
  }
}