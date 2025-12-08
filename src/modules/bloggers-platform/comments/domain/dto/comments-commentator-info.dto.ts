import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CommentsCommentatorInfoDto {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;
}