import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { SessionService } from '../application/session.service';
import { RefreshTokenRepositories } from '../infrastructure/refresh-token.repositiry';
import { CustomHttpException, DomainExceptionCode } from '../../../core/exceptions/domain.exception';
import { ExtractDeviceAndUserFromRequest } from '../guards/decorators/extract-device-and-user-from-request';
import { DeviceAndUserIdDto } from '../guards/dto/device-and-user-id.dto';
import { SessionModel } from '../domain/session.entity';
import { RefreshTokenGuard } from '../guards/refresh/refresh-token-auth.guard';

@Controller('/security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly refreshTokenRepositories: RefreshTokenRepositories,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('')
  async getAllSessions(@ExtractDeviceAndUserFromRequest() userInfo: DeviceAndUserIdDto) {
    return await this.sessionService.getAllDevices(userInfo.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteSessionById(@Param('id') id: string, @ExtractDeviceAndUserFromRequest() userInfo: DeviceAndUserIdDto) {
    const sessionDevice: SessionModel | null = await this.sessionService.findSessionByDeviceId(id);
    if (!sessionDevice) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    //TODO вынести через сервис
    if (sessionDevice.userId !== userInfo.userId) throw new CustomHttpException(DomainExceptionCode.FORBIDDEN);
    await this.sessionService.deleteDeviceById(userInfo.userId, id);
    return await this.refreshTokenRepositories.deleteSessionByDevice(userInfo.userId, id);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('')
  @HttpCode(204)
  async deleteAllSession(@ExtractDeviceAndUserFromRequest() userInfo: DeviceAndUserIdDto) {
    await this.sessionService.deleteAllDevicesExceptCurrent(userInfo.userId, userInfo.deviceId);
    return await this.refreshTokenRepositories.deleteAllTokensExceptCurrent(userInfo.userId, userInfo.deviceId);
  }
}