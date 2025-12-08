import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { likeCommentsDto } from './dto/like-comments.dto';

@Schema({ timestamps: true })
export class LikeComments {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({ type: String, enum: ['None', 'Like', 'Dislike'], default: 'None'})
  myStatus: 'None' | 'Like' | 'Dislike';

  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: likeCommentsDto): LikeCommentsDocument {
    const likeComments = new this();
    likeComments.userId = dto.userId;
    likeComments.commentId = dto.commentId;
    likeComments.myStatus = dto.myStatus;

    return likeComments as LikeCommentsDocument;
  }
}

export const LikeCommentsSchema = SchemaFactory.createForClass(LikeComments);

LikeCommentsSchema.loadClass(LikeComments);

export type LikeCommentsDocument = HydratedDocument<LikeComments>;