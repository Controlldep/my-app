import { Injectable } from '@nestjs/common';
import { UserModel } from '../domain/user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { UsersInputDto } from '../api/input-dto/users.input-dto';
import { PasswordHelper } from './helpers/password.helper';
import { AuthPasswordRecoveryInputDto } from '../api/input-dto/auth-password-recovery.input-dto';
import { CustomHttpException, DomainExceptionCode } from '../../../core/exceptions/domain.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: UsersInputDto): Promise<string> {
    const hashedPassword: string = await PasswordHelper.hashPassword(dto.password);

    const user: UserModel = UserModel.createInstance({
      ...dto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findUserById(id: string): Promise<UserModel> {
    const findUser: UserModel | null = await this.userRepository.findById(id);
    if (!findUser) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND)

    return findUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user: UserModel | null = await this.userRepository.findById(id);
    if (!user) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    return await this.userRepository.deleteUser(id);
  }

  async findByLoginOrEmail(dto: AuthPasswordRecoveryInputDto): Promise<UserModel | null> {
    const filter: { email: string } = { email: dto.email };
    return await this.userRepository.findByLoginOrEmail(filter);
  }
}
