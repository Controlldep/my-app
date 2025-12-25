import { Injectable } from '@nestjs/common';
import { SessionModel } from '../domain/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionModel)
    private readonly sessionRepository: Repository<SessionModel>,
  ) {}

  async createSession(dto: SessionModel): Promise<boolean> {
    const session: SessionModel = this.sessionRepository.create(dto);
    await this.sessionRepository.save(session);
    return true;
  }

  async findSessionByDeviceId(deviceId: string): Promise<SessionModel | null> {
    return await this.sessionRepository.findOne({
      where: { deviceId },
    });
  }

  async updateLastActiveDate(userId: string, deviceId: string, exp: number): Promise<boolean> {
    const result = await this.sessionRepository.update(
      { userId, deviceId },
      {
        lastActiveDate: new Date().toISOString(),
        expirationDate: new Date(exp * 1000).toISOString(),
      },
    );

    return result.affected === 1;
  }

  async getAllSessionsByUser(userId: string): Promise<SessionModel[]> {
    return await this.sessionRepository.find({
      where: { userId },
    });
  }

  async deleteAllSessionsByUserExceptCurrent(userId: string, currentDeviceId: string): Promise<boolean> {
    const result = await this.sessionRepository.delete({
      userId,
      deviceId: Not(currentDeviceId),
    });

    return (result.affected ?? 0) > 0;
  }

  async deleteSessionByDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.sessionRepository.delete({
      userId,
      deviceId,
    });

    return (result.affected ?? 0) > 0;
  }
}