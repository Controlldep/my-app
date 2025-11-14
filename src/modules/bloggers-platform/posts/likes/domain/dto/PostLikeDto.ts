import { Prop } from '@nestjs/mongoose';

export class PostLikeDto {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, enum: ['Like', 'Dislike', 'None'], default: 'None' })
  myStatus: string;
}
