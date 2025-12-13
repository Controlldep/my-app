import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { AuthService } from '../application/auth.service';
import { JwtService } from '../application/jwt.service';
import { AuthLoginInputDto } from './input-dto/auth-login.input-dto';
import { UserDocument } from '../domain/user.entity';
import type { Request, Response } from 'express';
import { AuthNewPasswordInputDto } from './input-dto/auth-new-password.input-dto';
import { AuthPasswordRecoveryInputDto } from './input-dto/auth-password-recovery.input-dto';
import { AuthRegistrationEmailResendingInputDto } from './input-dto/auth-registration-email-resending.input.dto';
import { AuthRegistrationConfirmationInputDto } from './input-dto/auth-registration-confirmation.input-dto';
import { AuthRegistrationInputDto } from './input-dto/auth-registration.input-dto';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth.guard';
import { UserIdDto } from '../guards/dto/user-id.dto';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request';
import { CustomHttpException, DomainExceptionCode } from '../../../core/exceptions/domain.exception';
import { SessionService } from '../application/session.service';
import jwt from 'jsonwebtoken';
import { getClientIp } from './helpers/get-client-ip.helper';
import { Session, SessionDocument } from '../domain/session.entity';
import { RefreshTokenDto } from '../../../core/dto/refresh-token.dto';
import { RefreshTokenDocument } from '../domain/refresh-token.entity';
import { RefreshTokenService } from '../application/refresh-token.service';
import { UserOutputDto } from './view-dto/user.output.dto';
import { RefreshTokenGuard } from '../guards/refresh/refresh-token-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../guards/trottler.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}
//TODO почистить тут все
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10_000 } })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthLoginInputDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user: UserDocument | null = await this.authService.login(dto);
    if (!user) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const deviceId: string = await this.sessionService.createDeviceID();
    const refreshToken: string = await this.jwtService.createRefreshToken(user._id.toString(), deviceId);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 20000 });
    const ip: string = getClientIp(req);
    const title: string = req.headers['user-agent'] ?? 'Unknown device';
    const decoded: { exp: number } = jwt.decode(refreshToken) as { exp: number };
    const expirationDate: string = new Date(decoded.exp * 1000).toISOString();

    const session: SessionDocument = Session.createInstance({
      userId: user._id.toString(),
      deviceId: deviceId,
      ip,
      title,
      lastActiveDate: new Date().toISOString(),
      expirationDate,
    });

    await this.sessionService.saveSession(session);

    const accessToken: { accessToken: string } = await this.jwtService.createAccessToken(user._id.toString());
    return accessToken;
  }

  @Post('new-password')
  async createNewPassword(@Body() dto: AuthNewPasswordInputDto) {
    const saveNewPassword = await this.authService.saveNewPassword(dto.recoveryCode, dto.newPassword);
    if (!saveNewPassword.success) throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async meHandler(@ExtractUserFromRequest() user: UserIdDto) {
    const findUser: UserOutputDto | null = await this.authService.meUser(user.userId);
    if (!findUser) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    return findUser;
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecoveryHandler(@Body() dto: AuthPasswordRecoveryInputDto) {
    const findUserByEmail: UserDocument | null = await this.usersService.findByLoginOrEmail(dto);
    if(!findUserByEmail) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND)

    await this.authService.passwordRecovery(findUserByEmail);
  }

  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10_000 } })
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() dto: AuthRegistrationEmailResendingInputDto) {
    await this.authService.resendRegistrationEmail(dto);
  }

  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10_000 } })
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmationHandler(@Body() dto: AuthRegistrationConfirmationInputDto) {
    const result = await this.authService.registrationConfirmationUser(dto);
    return result;
  }

  @HttpCode(204)
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10_000 } })
  @Post('registration')
  async registration(@Body() dto: AuthRegistrationInputDto, @Req() req: Request) {
    await this.authService.registerUser(dto);
  }

  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logOutHandler(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies.refreshToken;
    if (!cookies) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const verifyToken: RefreshTokenDto | null = await this.jwtService.verifyTokens(cookies);
    if (!verifyToken) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);
    const { userId, jti, deviceId } = verifyToken;

    const findToken: RefreshTokenDocument | null = await this.jwtService.findToken(userId, deviceId, jti);
    if (!findToken) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const session: SessionDocument | null = await this.sessionService.findSessionByDeviceId(deviceId);
    if (!session) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    if (session.userId !== userId) throw new CustomHttpException(DomainExceptionCode.FORBIDDEN);

    await this.refreshTokenService.deleteSessionByDevice(userId, deviceId);
    await this.sessionService.deleteDeviceById(userId, deviceId);

    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  }
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshTokenHandler(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies.refreshToken;
    if (!cookies) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const verifyToken: RefreshTokenDto | null = await this.jwtService.verifyTokens(cookies);
    if(!verifyToken) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const { userId, jti, deviceId } = verifyToken;

    const token: RefreshTokenDocument | null = await this.jwtService.findToken(userId, deviceId, jti);
    if (!token) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const createToken: { accessToken: string } = await this.jwtService.createAccessToken(userId);
    const refreshToken: string = await this.jwtService.updateRefreshToken(userId, deviceId);

    const decoded: { exp: number } = jwt.decode(refreshToken!) as { exp: number };
    await this.sessionService.updateLastActiveDate(userId, deviceId, decoded.exp);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 2000000 });

    return createToken;
  }
}

