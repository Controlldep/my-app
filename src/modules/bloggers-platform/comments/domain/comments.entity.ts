import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { commentsDto } from './dto/comments.dto';
import { CommentsLikesInfoDto } from './dto/comments-likes-info.dto';
import { CommentsCommentatorInfoDto } from './dto/comments-commentator-info.dto';

@Schema({ timestamps: true })
export class Comments {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: CommentsCommentatorInfoDto })
  commentatorInfo: CommentsCommentatorInfoDto;

  @Prop({ type: CommentsLikesInfoDto })
  likesInfo: CommentsLikesInfoDto;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: commentsDto): CommentsDocument {
    const comments = new this();
    comments.content = dto.content;
    comments.postId = dto.postId;
    comments.commentatorInfo = {
      userId: dto.commentatorInfo.userId,
      userLogin: dto.commentatorInfo.userLogin,
    };
    comments.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    }

    return comments as CommentsDocument;
  }
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.loadClass(Comments);

export type CommentsDocument = HydratedDocument<Comments>;