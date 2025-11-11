import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './infrastructure/user.repository';
import { User, UserSchema } from './domain/user.entity';
import { UserService } from './application/user.service';
import { UserController } from './api/user.controllers';
import { UserQueryRepository } from './infrastructure/user.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository, UserService, UserQueryRepository],
  controllers: [UserController],
})
export class UserModule {}
