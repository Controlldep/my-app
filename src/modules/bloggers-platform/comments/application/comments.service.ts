import { CommentsRepository } from '../infrastructure/comments.repository';
import { Injectable } from '@nestjs/common';
import { LikeCommentsRepository } from '../../comments-like/infrastructrure/like-comments.repository';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { LikeCommentsDocument } from '../../comments-like/domain/like-comments.entity';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { UpdateCommentsDto } from '../api/dto/input-dto/update-comments.dto';
import { CommentsInputDto } from '../../posts/api/dto/input-dto/comments.input.dto';
import { PostDocument } from '../../posts/domain/post.entity';
import { UserDocument } from '../../../user-accounts/domain/user.entity';
import { UserService } from '../../../user-accounts/application/user.service';
import { PostService } from '../../posts/application/post.service';
import { LikeCommentsService } from '../../comments-like/application/like-comments.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly likeCommentsService: LikeCommentsService,
  ) {}

  async createComment(dto: string, userId: string, id: string): Promise<string | null> {
    const findPostInDb: PostDocument | null = await this.postService.findPostById(id);
    if (!findPostInDb) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const findUserInDb: UserDocument | null = await this.userService.findUserById(userId);
    //TODO явно под вопросом 401 или 404
    if (!findUserInDb) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const comment: CommentsDocument = Comments.createInstance({
      content: dto,
      postId: id,
      commentatorInfo: {
        userId: userId,
        userLogin: findUserInDb.login,
      },
    });

    const createCommentInDb: string = await this.commentsRepository.save(comment);

    await this.likeCommentsService.createLikeForComments(userId, createCommentInDb);

    return createCommentInDb;
  }

  async updateComment(id: string, dto: UpdateCommentsDto): Promise<void> {
    return this.commentsRepository.updateComment(id, dto.content);
  }

  async deleteComment(id: string): Promise<void> {
    return this.commentsRepository.deleteComment(id);
  }

  async getCommentById(id: string): Promise<CommentsDocument | null> {
    return this.commentsRepository.getCommentById(id);
  }
}