import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }
}
