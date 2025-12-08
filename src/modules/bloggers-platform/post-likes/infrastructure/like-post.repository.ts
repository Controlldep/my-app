import { Injectable } from '@nestjs/common';
import { LikePost, LikePostDocument } from '../domain/like-post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LikePostRepositories {
  constructor(@InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>) {}

  async createLike(dto: LikePostDocument): Promise<string> {
    const likePost: LikePostDocument = new this.likePostModel(dto);
    const savedLikePost: LikePostDocument = await likePost.save();
    return savedLikePost._id.toString();
  }

  async checkStatus(userId: string, postId: string): Promise<LikePostDocument | null> {
    return this.likePostModel.findOne({userId: userId, postId: postId});
  }

  async updateStatus(userId: string, postId: string, status: string) {
    await this.likePostModel.findOneAndUpdate(
      { userId: userId, postId: postId},
      { $set: { myStatus: status } },
      { returnDocument: 'after' }
    );
  }

  async findAllLikesForPost(postId: string) {
    const result = await this.likePostModel.find({ postId, myStatus: 'Like' })
      .sort({ addedAt: -1 })
      .select({
        addedAt: 1,
        userId: 1,
        login: 1,
        _id: 0 })
      .limit(3)

    return result
  }
}