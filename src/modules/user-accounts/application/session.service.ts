import { Injectable } from '@nestjs/common';
import { SessionModel } from '../domain/session.entity';
import { SessionRepository } from '../infrastructure/session.repository';
import { v4 as uuidv4 } from 'uuid';
import { SessionInputDto } from '../api/input-dto/session.input.dto';
import { SessionViewDto } from '../api/view-dto/session-view.dto';
@Injectable()
export class SessionService {
  constructor(private readonly sessionRepositories: SessionRepository) {}

  async createDeviceID() {
    return await uuidv4();
  }

  async saveSession(sessionData: SessionInputDto): Promise<boolean> {
    const session: SessionModel = SessionModel.createInstance({
      userId: sessionData.userId,
      deviceId: sessionData.deviceId,
      ip: sessionData.ip,
      title: sessionData.title,
      lastActiveDate: sessionData.lastActiveDate,
      expirationDate: sessionData.expirationDate,
    });
    return await this.sessionRepositories.createSession(session);
  }

  async findSessionByDeviceId(deviceId: string): Promise<SessionModel | null> {
    const findSessionById: SessionModel | null = await this.sessionRepositories.findSessionByDeviceId(deviceId);

    return findSessionById;
  }

  async getAllDevices(userId: string): Promise<SessionViewDto[]> {
    const getDevices: SessionModel[] = await this.sessionRepositories.getAllSessionsByUser(userId);
    const items: SessionViewDto[] = getDevices.map((blog) => SessionViewDto.mapToView(blog));
    return items;
  }

  async deleteDeviceById(userId: string, deviceId: string): Promise<boolean> {
    const deleteDevice: boolean = await this.sessionRepositories.deleteSessionByDevice(userId, deviceId);

    return deleteDevice;
  }

  async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string): Promise<boolean> {
    const deleted: boolean = await this.sessionRepositories.deleteAllSessionsByUserExceptCurrent(userId, currentDeviceId);
    return deleted;
  }

  async updateLastActiveDate(userId: string, deviceId: string, exp: number): Promise<boolean> {
    const updateActive: boolean = await this.sessionRepositories.updateLastActiveDate(userId, deviceId, exp);

    return updateActive;
  }
}
