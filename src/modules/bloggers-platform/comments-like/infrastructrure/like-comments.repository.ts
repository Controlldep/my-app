import { Injectable } from '@nestjs/common';
import { LikeCommentsModel } from '../domain/like-comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LikeCommentsRepository {
  constructor(
    @InjectRepository(LikeCommentsModel)
    private readonly likeCommentsRepository: Repository<LikeCommentsModel>,
  ) {}

  async save(dto: LikeCommentsModel): Promise<void> {
    const likeComment = this.likeCommentsRepository.create(dto);
    await this.likeCommentsRepository.save(likeComment);
  }

  async checkStatus(userId: string | undefined, commentId: string): Promise<LikeCommentsModel | null> {
    return await this.likeCommentsRepository.findOne({
      where: { userId, commentId },
    });
  }

  async updateStatus(userId: string, commentId: string, status: 'None' | 'Like' | 'Dislike'): Promise<void> {
    await this.likeCommentsRepository.update(
      { userId, commentId },
      { myStatus: status }
    );
  }
}
