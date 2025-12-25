import { Injectable } from '@nestjs/common';
import { LikePostModel } from '../domain/like-post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LikePostRepositories {
  constructor(
    @InjectRepository(LikePostModel)
    private readonly likePostRepositories: Repository<LikePostModel>,
  ) {}

  async createLike(dto: LikePostModel): Promise<string> {
    const likePost = this.likePostRepositories.create(dto);
    const savedLikePost = await this.likePostRepositories.save(likePost);
    return savedLikePost.id.toString();
  }

  async checkStatus(userId: string, postId: string): Promise<LikePostModel | null> {
    return await this.likePostRepositories.findOne({
      where: { userId, postId },
    });
  }

  async updateStatus(userId: string, postId: string, status: 'Like' | 'None' | 'Dislike') {
    await this.likePostRepositories.update(
      { userId, postId },
      { myStatus: status },
    );
  }

  async findAllLikesForPost(postId: string) {
    const result = await this.likePostRepositories.find({
      where: { postId, myStatus: 'Like' },
      order: { addedAt: 'DESC' },
      select: ['addedAt', 'userId', 'login'],
      take: 3,
    });
    return result;
  }
}