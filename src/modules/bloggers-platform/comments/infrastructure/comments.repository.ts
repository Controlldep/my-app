import { Injectable } from '@nestjs/common';
import { CommentsModel } from '../domain/comments.entity';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
  ) {}

  async getCommentById(id: string): Promise<CommentsModel | null> {
    return await this.commentsRepository.findOne({ where: { id } });
  }

  async save(dto: CommentsModel): Promise<string> {
    const comment = this.commentsRepository.create(dto);
    const savedComment = await this.commentsRepository.save(comment);
    return savedComment.id.toString();
  }

  async updateComment(id: string, content: string): Promise<void> {
    const result = await this.commentsRepository.update(id, { content });
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }

  async deleteComment(id: string): Promise<void> {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }

  async updateLikesInfo(comment: CommentsModel): Promise<void> {
    const result = await this.commentsRepository.update(comment.id, { likesInfo: comment.likesInfo });
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }
}

