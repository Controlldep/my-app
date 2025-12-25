import { Body, Controller, Delete, Get, HttpCode, Param, Put, Req, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { CommentsService } from '../application/comments.service';
import { LikeCommentsService } from '../../comments-like/application/like-comments.service';
import { LikeCommentsRepository } from '../../comments-like/infrastructrure/like-comments.repository';
import { JwtService } from '../../../user-accounts/application/jwt.service';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { JwtAuthGuard } from '../../../user-accounts/guards/jwt/jwt-auth.guard';
import { CommentsModel } from '../domain/comments.entity';
import { LikeCommentsModel } from '../../comments-like/domain/like-comments.entity';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/extract-user-from-request';
import { UserIdDto } from '../../../user-accounts/guards/dto/user-id.dto';
import { UpdateCommentsDto } from './dto/input-dto/update-comments.dto';
import { UpdateLikeStatusDto } from './dto/input-dto/update-like-status.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likeService: LikeCommentsService,
    private readonly likeCommentsRepository: LikeCommentsRepository,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  async getCommentByIdHandler(@Param('id') id: string, @Req() req: Request) {
    let token: string;
    let userId: string | undefined;

    if(req.headers['authorization']){
      token= req.headers['authorization'].split(" ")[1];
      userId = await this.jwtService.getUserIdByToken(token);
    }else{
      userId = undefined;
    }
    return await this.commentsQueryRepository.getCommentsById(id, userId);
  }

  //TODO вынести логику
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCommentHandler(@Param('id') id: string, @ExtractUserFromRequest() user: UserIdDto) {
    const comment: CommentsModel | null = await this.commentsService.getCommentById(id);
    if (!comment) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    if (comment.commentatorInfo.userId !== user.userId) throw new CustomHttpException(DomainExceptionCode.FORBIDDEN);

    await this.commentsService.deleteComment(id);
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCommentHandler(@Param('id') id: string, @ExtractUserFromRequest() user: UserIdDto, @Body() dto: UpdateCommentsDto) {
    const comment: CommentsModel | null = await this.commentsService.getCommentById(id);
    if (!comment) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    if (comment.commentatorInfo.userId !== user.userId) throw new CustomHttpException(DomainExceptionCode.FORBIDDEN);
    await this.commentsService.updateComment(id, dto);
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  async updateLikeStatus(@Param('id') id: string, @ExtractUserFromRequest() user: UserIdDto, @Body() dto: UpdateLikeStatusDto) {
    const userId: string = user.userId;
    const { likeStatus } = dto;
    if (!['Like', 'Dislike', 'None'].includes(likeStatus)) {
      throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'Invalid status', [
        {
          constraints: {
            matches: 'Invalid status',
          },
          property: 'likeStatus',
        },
      ]);
    }

    const findComment: CommentsModel | null = await this.commentsService.getCommentById(id);
    if (!findComment) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const findUserLikeSchema = await this.likeService.checkStatus(userId, findComment.id.toString())
//Todo в сервисы унести
    if(!findUserLikeSchema) {
      const newLike: LikeCommentsModel = LikeCommentsModel.createInstance({
        userId,
        commentId: findComment.id.toString(),
        myStatus: 'None',
      });
      await this.likeCommentsRepository.save(newLike);
    }

    await this.likeService.changeStatus(userId, findComment, likeStatus);
  }
}
