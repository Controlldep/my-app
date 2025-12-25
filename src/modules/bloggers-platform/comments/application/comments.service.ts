import { CommentsRepository } from '../infrastructure/comments.repository';
import { Injectable } from '@nestjs/common';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { CommentsModel } from '../domain/comments.entity';
import { UpdateCommentsDto } from '../api/dto/input-dto/update-comments.dto';
import { PostModel } from '../../posts/domain/post.entity';
import { UserModel } from '../../../user-accounts/domain/user.entity';
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
    const findPostInDb: PostModel | null = await this.postService.findPostById(id);
    if (!findPostInDb) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const findUserInDb: UserModel | null = await this.userService.findUserById(userId);
    //TODO явно под вопросом 401 или 404
    if (!findUserInDb) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const comment: CommentsModel = CommentsModel.createInstance({
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

  async getCommentById(id: string): Promise<CommentsModel | null> {
    return this.commentsRepository.getCommentById(id);
  }
}