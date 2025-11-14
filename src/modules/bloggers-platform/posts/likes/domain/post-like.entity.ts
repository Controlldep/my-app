import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostLikeDto } from './dto/PostLikeDto';

@Schema({ timestamps: true })
export class PostLike {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, enum: ['Like', 'Dislike', 'None'], default: 'None' })
  myStatus: string;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: PostLikeDto): PostLikeDocument {
    const postLike: PostLike = new this();
    postLike.userId = dto.userId;
    postLike.postId = dto.postId;
    postLike.login = dto.login;
    postLike.addedAt = new Date().toISOString();
    postLike.myStatus = dto.myStatus;

    return postLike as PostLikeDocument;
  }
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.loadClass(PostLike);

export type PostLikeDocument = HydratedDocument<PostLike>;
