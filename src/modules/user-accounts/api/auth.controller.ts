import {
  BadRequestException,
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  NotFoundException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { AuthService } from '../application/auth.service';
import { JwtService } from '../application/jwt.service';
import { AuthLoginInputDto } from './input-dto/auth-login.input-dto';
import { UserDocument } from '../domain/user.entity';
import type { Response } from 'express';
import { AuthNewPasswordInputDto } from './input-dto/auth-new-password.input-dto';
import { AuthPasswordRecoveryInputDto } from './input-dto/auth-password-recovery.input-dto';
import { AuthRegistrationEmailResendingInputDto } from './input-dto/auth-registration-email-resending.input.dto';
import { AuthRegistrationConfirmationInputDto } from './input-dto/auth-registration-confirmation.input-dto';
import { AuthRegistrationInputDto } from './input-dto/auth-registration.input-dto';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth.guard';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request';
import { CustomHttpException, DomainExceptionCode } from '../../../core/exceptions/domain.exception';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthLoginInputDto, @Res({ passthrough: true }) res: Response) {
    const user: UserDocument | null = await this.authService.login(dto);
    if (!user) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const accessToken: { accessToken: string } = await this.jwtService.createAccessToken(user._id.toString());
    const refreshToken: string = 'fdgdfgdfg'; //заглушка
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 20000 });
    return accessToken;
  }

  @Post('new-password')
  async createNewPassword(@Body() dto: AuthNewPasswordInputDto) {
    const saveNewPassword = await this.authService.saveNewPassword(dto.recoveryCode, dto.newPassword);
    if (!saveNewPassword.success) throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async meHandler(@ExtractUserFromRequest() user: UserContextDto) {
    return await this.authService.meUser(user.userId);
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecoveryHandler(@Body() dto: AuthPasswordRecoveryInputDto) {
    const findUserByEmail: UserDocument | null = await this.usersService.findByLoginOrEmail( dto );
    if(!findUserByEmail) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND)

    await this.authService.passwordRecovery(findUserByEmail);
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() dto: AuthRegistrationEmailResendingInputDto) {
    await this.authService.resendRegistrationEmail(dto);
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmationHandler(@Body() dto: AuthRegistrationConfirmationInputDto) {
    const result = await this.authService.registrationConfirmationUser(dto);
    return result;
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() dto: AuthRegistrationInputDto) {
    await this.authService.registerUser(dto);
  }
}

