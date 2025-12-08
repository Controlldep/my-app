import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeComments, LikeCommentsDocument } from '../domain/like-comments.entity';

@Injectable()
export class LikeCommentsRepository {
  constructor(@InjectModel(LikeComments.name) private likeCommentsModel: Model<LikeComments>) {}

  async save(dto: LikeCommentsDocument): Promise<void> {
    const result: LikeCommentsDocument = new this.likeCommentsModel(dto);
    await result.save();
  }

  async checkStatus(id: string | undefined, commentID: string): Promise<LikeCommentsDocument | null> {
    const checkStatus: LikeCommentsDocument | null = await this.likeCommentsModel.findOneAndUpdate({ userId: id, commentId: commentID });
    return checkStatus;
  }

  async updateStatus(userId: string , commentId: string , status: string): Promise<void> {
    await this.likeCommentsModel.findOneAndUpdate(
      { userId: userId, commentId: commentId },
      { $set: { myStatus: status } },
      { returnDocument: 'after' }
    );
  }
}
