import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UsersInputDto } from '../api/input-dto/users.input-dto';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({ type: String, default: null })
  confirmationCode: string | null;

  @Prop({ type: Date, default: null })
  expirationDate: Date | null;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(dto: UsersInputDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;
    user.isConfirmed = false;
    user.confirmationCode = dto.confirmationCode || null;
    user.expirationDate = dto.expirationDate || null;

    return user as UserDocument;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
