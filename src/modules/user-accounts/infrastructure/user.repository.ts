import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(dto: UserDocument): Promise<UserDocument> {
    const user: UserDocument = new this.userModel(dto);
    return user.save();
  }

  async deleteUser(id: string) {
    const deleteUser = await this.userModel.deleteOne({ _id: id });
    return deleteUser.deletedCount === 1;
  }
}
