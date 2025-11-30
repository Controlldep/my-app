import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UpdatePostInputDto } from './dto/input-dto/update-post.input-dto';
import { PostInputDto } from './dto/input-dto/post.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostService } from '../application/post.service';
import { PostQueryRepository } from '../infrastructure/post.query-repository';
import { PostViewDto } from './dto/view-dto/post.view-dto';
import { GetPostQueryInputDto } from './dto/input-dto/get-posts-query-params.input-dto';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';

@Controller('posts')
export class PostControllers {
  constructor(
    private readonly postService: PostService,
    private readonly PostQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async getAllPosts(@Query() query: GetPostQueryInputDto): Promise<PaginatedViewDto<PostViewDto[]>> {
    return await this.PostQueryRepository.getAllPosts(query);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.PostQueryRepository.getPostById(id);
  }

  @Get(':id/comments')
  async getAllCommentsForPost(@Param('id') id: string) {
    const findPost = await this.postService.findPostById(id);
    if (!findPost) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    return {
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: [],
    };
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
