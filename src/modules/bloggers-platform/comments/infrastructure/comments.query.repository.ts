import { Injectable } from '@nestjs/common';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { LikeCommentsRepository } from '../../comments-like/infrastructrure/like-comments.repository';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { CommentsRepository } from './comments.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeComments, LikeCommentsDocument } from '../../comments-like/domain/like-comments.entity';
import { CommentsViewDto } from '../api/dto/output-dto/comments.view.dto';
import { GetCommentsQueryInputDto } from '../api/dto/input-dto/get-comments-query.input.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    private readonly likeCommentsRepository: LikeCommentsRepository,
    private readonly commentsRepository: CommentsRepository,
    @InjectModel(Comments.name) private commentsModel: Model<CommentsDocument>,
    @InjectModel(LikeComments.name) private likeCommentsModel: Model<LikeCommentsDocument>,
  ) {}
  async getCommentsById(id: string, userId: string | undefined) {
    const dbComment: CommentsDocument | null = await this.commentsRepository.getCommentById(id);
    if (!dbComment) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    let likeStatus = await this.likeCommentsRepository.checkStatus(userId, dbComment._id.toString());
    const myStatus = likeStatus ? likeStatus.myStatus : 'None';

    const doc = {
      id: dbComment._id.toString(),
      content: dbComment.content,
      commentatorInfo: dbComment.commentatorInfo,
      createdAt: dbComment.createdAt,
      likesInfo: {
        likesCount: dbComment.likesInfo.likesCount,
        dislikesCount: dbComment.likesInfo.dislikesCount,
        myStatus,
      }
    }
    return doc;
  }

  async getAllCommentsForPost(pagination: GetCommentsQueryInputDto, postId: string, userId?: string | null):Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const filter: { postId: string } = { postId };
    const totalCount: number = await this.commentsModel.countDocuments(filter);

    const items: CommentsDocument[] = await this.commentsModel
      .find(filter)
      .sort({ createdAt: pagination.sortDirection })
      .skip((pagination.pageNumber - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    let userLikes: LikeComments[] = [];

    if (userId) {
      const commentIds = items.map(c => c._id.toString());
      userLikes = await this.likeCommentsModel.find({
        userId,
        commentId: { $in: commentIds },
      });
    }

    const mappedItems: CommentsViewDto[] = items.map(comment => {
      const userLike = userLikes.find(like => like.commentId === comment._id.toString());
      const myStatus = userLike ? userLike.myStatus : "None";

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
