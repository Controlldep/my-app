import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './infrastructure/user.repository';
import { User, UserSchema } from './domain/user.entity';
import { UserService } from './application/user.service';
import { UserController } from './api/user.controllers';
import { UserQueryRepository } from './infrastructure/user.query.repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { EmailService } from './application/email.service';
import { JwtService } from './application/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { settings } from '../../settings';
import { SecurityDevicesController } from './api/session.controller';
import { RefreshTokenService } from './application/refresh-token.service';
import { SessionService } from './application/session.service';
import { RefreshTokenRepositories } from './infrastructure/refresh-token.repositiry';
import { SessionRepositories } from './infrastructure/session.repository';
import { RefreshToken, RefreshTokenSchema } from './domain/refresh-token.entity';
import { Session, SessionSchema } from './domain/session.entity';
import { RefreshTokenStrategy } from './guards/strategy/refresh-token.strategy';
import { RefreshTokenGuard } from './guards/refresh/refresh-token-auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: settings.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10_000,
          limit: 5,
        },
      ],
    }),
  ],
  providers: [
    UserRepository, UserService, UserQueryRepository, AuthService, EmailService,
    JwtService, JwtStrategy, JwtAuthGuard, RefreshTokenService, SessionService,
    RefreshTokenRepositories, SessionRepositories, RefreshTokenStrategy, RefreshTokenGuard],
  controllers: [UserController, AuthController, SecurityDevicesController],
  exports: [UserService, RefreshTokenRepositories],
})
export class UserModule {}
