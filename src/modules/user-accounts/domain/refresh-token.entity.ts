import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DomainRefreshTokenDto } from '../dto/domain-refresh-token.dto';

@Schema()
export class RefreshToken {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  jtiHash: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  expiresAt: string | null;

  static createInstance(dto: DomainRefreshTokenDto): RefreshTokenDocument {
    const refreshToken = new this();
    refreshToken.userId = dto.userId;
    refreshToken.jtiHash = dto.jtiHash;
    refreshToken.deviceId = dto.deviceId;
    refreshToken.expiresAt = dto.expiresAt;

    return refreshToken as RefreshTokenDocument;
  }
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.loadClass(RefreshToken);

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;