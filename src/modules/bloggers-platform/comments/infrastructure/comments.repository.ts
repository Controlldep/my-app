import { Injectable } from '@nestjs/common';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comments.name) private commentsModel: Model<CommentsDocument>) {}

  async getCommentById(id: string): Promise<CommentsDocument | null> {
    return this.commentsModel.findOne({ _id: id, deletedAt: null });
  }

  async save(dto: CommentsDocument): Promise<string>{
    const result: CommentsDocument = new this.commentsModel(dto);
    const saveComments: CommentsDocument = await result.save();

    return saveComments._id.toString();
  }

  async updateComment(id: string, content: string): Promise<void> {
    const result = await this.commentsModel.findByIdAndUpdate(id, { content });
    if (!result) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
  }

  async deleteComment(id: string): Promise<void> {
    const deleteComments: CommentsDocument | null = await this.commentsModel.findByIdAndDelete({ _id: id });
    if(!deleteComments) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
  }

  async updateLikesInfo(comment: CommentsDocument): Promise<void> {
    await this.commentsModel.findByIdAndUpdate(
      { _id: comment._id },
      { $set: { likesInfo: comment.likesInfo } } )
  }
}

