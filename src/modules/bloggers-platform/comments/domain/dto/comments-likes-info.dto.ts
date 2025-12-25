import { Prop, Schema } from '@nestjs/mongoose';

// @Schema({ _id: false })
// export class CommentsLikesInfoDto {
//   @Prop({ type: Number, default: 0 })
//   likesCount: number;
//
//   @Prop({ type: Number, default: 0 })
//   dislikesCount: number;
// }

export class CommentsLikesInfoDto {
  likesCount: number;
  dislikesCount: number;
}