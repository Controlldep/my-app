import { Injectable } from '@nestjs/common';
import { UserModel } from '../domain/user.entity';
import { UserFilter } from '../api/type/user.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async findById(id: string): Promise<UserModel | null> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  async save(dto: UserModel): Promise<string> {
    const user: UserModel = this.userRepository.create(dto);
    const saveUSer: UserModel = await this.userRepository.save(user);

    return saveUSer.id.toString();
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleteUser = await this.userRepository.delete(id);
    return deleteUser.affected === 1;
  }

  async verifyUser(id: string): Promise<UpdateResult> {
    return this.userRepository.update(id, { isConfirmed: true, confirmationCode: null, expirationDate: null });
  }

  async findByLoginOrEmail(filter: UserFilter): Promise<UserModel | null> {
    return this.userRepository.findOne({
      where: filter,
    });
  }

  async findUserByConfirmationCode(code: string): Promise<UserModel | null> {
    return this.userRepository.findOne({
      where: { confirmationCode: code },
    });
  }

  async updateConfirmation(id: string, code: string, expirationDate: Date): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      confirmationCode: code,
      expirationDate,
    });
  }

  async updatePassword(id: string, password: string): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      passwordHash: password,
    });
  }
}
