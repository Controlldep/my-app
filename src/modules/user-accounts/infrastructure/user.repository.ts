import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import { UserFilter } from '../api/type/user.type';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(dto: UserDocument): Promise<string> {
    const user: UserDocument = new this.userModel(dto);
    const saveUSer: UserDocument = await user.save();

    return saveUSer._id.toString();
  }

  async deleteUser(id: string) {
    const deleteUser = await this.userModel.deleteOne({ _id: id });
    return deleteUser.deletedCount === 1;
  }

  async verifyUser(userId: string) {
    return this.userModel.updateOne({ _id: userId }, { $set: { isConfirmed: true, confirmationCode: null, expirationDate: null } });
  }

  async findByLoginOrEmail(filter: UserFilter) {
    return this.userModel.findOne(filter);
  }

  async findUserByConfirmationCode(code: string) {
    return this.userModel.findOne({ confirmationCode: code });
  }

  async updateConfirmation(userId: string, code: string, expirationDate: Date) {
    return this.userModel.updateOne({ _id: userId }, { $set: { confirmationCode: code, expirationDate: expirationDate } });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return this.userModel.updateOne({ _id: userId }, { $set: { password: passwordHash } });
  }
}
