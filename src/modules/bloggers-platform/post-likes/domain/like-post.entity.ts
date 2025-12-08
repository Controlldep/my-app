import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikePostDto } from './dto/like-post.dto';

@Schema()
export class LikePost {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, enum: ['None', 'Like', 'Dislike'], default: 'None'})
  myStatus: 'None' | 'Like' | 'Dislike';


  static createInstance(dto: LikePostDto): LikePostDocument {
    const likePost = new this();
    likePost.userId = dto.userId;
    likePost.postId = dto.postId;
    likePost.login = dto.login;
    likePost.addedAt = new Date().toISOString();
    likePost.myStatus = dto.myStatus;

    return likePost as LikePostDocument;
  }
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);

LikePostSchema.loadClass(LikePost);

export type LikePostDocument = HydratedDocument<LikePost>;