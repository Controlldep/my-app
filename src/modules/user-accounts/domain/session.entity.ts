import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SessionInputDto } from '../api/input-dto/session.input.dto';

@Schema()
export class Session {
  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  lastActiveDate: string;

  @Prop({ type: String, required: true })
  expirationDate: string;

  static createInstance(dto: SessionInputDto): SessionDocument {
    const session = new this();
    session.deviceId = dto.deviceId;
    session.userId = dto.userId;
    session.ip = dto.ip;
    session.title = dto.title;
    session.lastActiveDate = dto.lastActiveDate;
    session.expirationDate = dto.expirationDate;

    return session as SessionDocument;
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.loadClass(Session);

export type SessionDocument = HydratedDocument<Session>;
