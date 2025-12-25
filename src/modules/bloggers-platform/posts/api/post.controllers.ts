import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UpdatePostInputDto } from './dto/input-dto/update-post.input-dto';
import { PostInputDto } from './dto/input-dto/post.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostService } from '../application/post.service';
import { PostQueryRepository } from '../infrastructure/post.query-repository';
import { PostViewDto } from './dto/view-dto/post.view-dto';
import { GetPostQueryInputDto } from './dto/input-dto/get-posts-query-params.input-dto';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { CommentsInputDto } from './dto/input-dto/comments.input.dto';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/extract-user-from-request';
import { UserIdDto } from '../../../user-accounts/guards/dto/user-id.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { CommentsService } from '../../comments/application/comments.service';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { PostModel } from '../domain/post.entity';
import { JwtService } from '../../../user-accounts/application/jwt.service';
import { GetCommentsQueryInputDto } from '../../comments/api/dto/input-dto/get-comments-query.input.dto';
import { CommentsViewDto } from '../../comments/api/dto/output-dto/comments.view.dto';
import { JwtAuthGuard } from '../../../user-accounts/guards/jwt/jwt-auth.guard';
import { UpdateLikeStatusDto } from '../../comments/api/dto/input-dto/update-like-status.dto';
import { UserModel } from '../../../user-accounts/domain/user.entity';
import { LikePostService } from '../../post-likes/application/like-post.service';
import { UserService } from '../../../user-accounts/application/user.service';
import { LikePostModel } from '../../post-likes/domain/like-post.entity';

@Controller('posts')
export class PostControllers {
  constructor(
    private readonly postService: PostService,
    private readonly PostQueryRepository: PostQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly jwtService: JwtService,
    private readonly likePostService: LikePostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllPosts(@Query() query: GetPostQueryInputDto, @Req() req: Request): Promise<PaginatedViewDto<PostViewDto[]>> {
    let userId;
    if(req.headers['authorization']){
      let token = req.headers['authorization'].split(" ")[1];
      userId = await this.jwtService.getUserIdByToken(token);
    }else{
      userId = undefined;
    }
    return await this.PostQueryRepository.getAllPosts(query, userId);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req: Request) {
    let userId;
    if(req.headers['authorization']){
      let token = req.headers['authorization'].split(" ")[1];
      userId = await this.jwtService.getUserIdByToken(token);
    }else{
      userId = undefined;
    }
    return await this.PostQueryRepository.getPostById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPostHandler(@Param('id') id: string, @Body() dto: CommentsInputDto, @ExtractUserFromRequest() user: UserIdDto){
    const userId: string = user.userId;

    const createNewComment: string | null = await this.commentsService.createComment(dto.content, userId, id);
    if(!createNewComment) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    return await this.commentsQueryRepository.getCommentsById(createNewComment, userId);
  }
  //TODO было бы логично создать прослойку и добавить сервис для этого эндпоинта дабы убрать вот эту расшифровку в контроллере
  @Get(':id/comments')
  async getCommentsByPostHandler(@Param('id') id: string, @Req() req: Request, @Query() query: GetCommentsQueryInputDto): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const findPostInDb: PostModel | null = await this.postService.findPostById(id);
    if (!findPostInDb) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const token = req.headers['authorization']?.split(" ")[1];
    const userId = token ? await this.jwtService.getUserIdByToken(token) : null;
    return await this.commentsQueryRepository.getAllCommentsForPost(query, id, userId);
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
    //Todo в сервисы унести
    const findPost: PostModel | null = await this.postService.findPostById(id);
    if (!findPost) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const findUser: UserModel | null = await this.userService.findUserById(userId);

    const findUserLikeSchema: LikePostModel | null = await this.likePostService.checkStatus(userId, findPost.id.toString());

    if(!findUserLikeSchema) {
      await this.likePostService.createPostLike(userId, findPost, findUser!.login);
    }

    await this.likePostService.changeStatus(userId, findPost, likeStatus);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() dto: PostInputDto) {
    const result = await this.postService.createPost(dto);
    return await this.PostQueryRepository.getPostById(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() dto: UpdatePostInputDto) {
    return await this.postService.updatePost(id, dto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }
}
