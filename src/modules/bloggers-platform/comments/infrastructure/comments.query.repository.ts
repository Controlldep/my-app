import { Injectable } from '@nestjs/common';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { CommentsModel } from '../domain/comments.entity';
import { LikeCommentsModel } from '../../comments-like/domain/like-comments.entity';
import { CommentsViewDto } from '../api/dto/output-dto/comments.view.dto';
import { GetCommentsQueryInputDto } from '../api/dto/input-dto/get-comments-query.input.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    @InjectRepository(LikeCommentsModel)
    private readonly likeCommentsRepository: Repository<LikeCommentsModel>,
  ) {}
  async getCommentsById(id: string, userId?: string) {
    const dbComment = await this.commentsRepository.findOne({ where: { id } });
    if (!dbComment) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const likeStatus = userId
      ? await this.likeCommentsRepository.findOne({
        where: { commentId: dbComment.id, userId },
      })
      : null;

    const myStatus = likeStatus ? likeStatus.myStatus : 'None';

    return {
      id: dbComment.id,
      content: dbComment.content,
      commentatorInfo: dbComment.commentatorInfo,
      createdAt: dbComment.createdAt,
      likesInfo: {
        likesCount: dbComment.likesInfo.likesCount,
        dislikesCount: dbComment.likesInfo.dislikesCount,
        myStatus,
      },
    };
  }

  async getAllCommentsForPost(
    pagination: GetCommentsQueryInputDto,
    postId: string,
    userId?: string,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const [items, totalCount] = await this.commentsRepository.findAndCount({
      where: { postId },
      order: { createdAt: pagination.sortDirection },
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    let userLikes: LikeCommentsModel[] = [];
    if (userId) {
      const commentIds = items.map(c => c.id);
      userLikes = await this.likeCommentsRepository.find({
        where: { commentId: In(commentIds), userId },
      });
    }

    const mappedItems = items.map(comment => {
      const userLike = userLikes.find(like => like.commentId === comment.id);
      const myStatus = userLike ? userLike.myStatus : 'None';
      return CommentsViewDto.mapToView(comment, myStatus);
    });

    return {
      pagesCount: Math.ceil(totalCount / pagination.pageSize),
      totalCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      items: mappedItems,
    };
  }
}
