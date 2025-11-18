import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../domain/user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { UsersInputDto } from '../api/input-dto/users.input-dto';
import { PasswordHelper } from './helpers/password.helper';
import { UserQueryRepository } from '../infrastructure/user.query-repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async createUser(dto: UsersInputDto): Promise<string> {
    const hashedPassword: string = await PasswordHelper.hashPassword(
      dto.password,
    );

    const user: UserDocument = User.createInstance({
      ...dto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  //TODO статус код в сервисе

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.userRepository.deleteUser(id);
  }
}
