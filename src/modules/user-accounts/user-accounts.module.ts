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
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { settings } from '../../settings';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: settings.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    UserRepository, UserService, UserQueryRepository, AuthService, EmailService,
    JwtService, JwtStrategy, JwtAuthGuard],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule {}
