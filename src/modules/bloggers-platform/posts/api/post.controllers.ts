import {
  Body,
  Controller,
  Delete,
  Get, HttpException, HttpStatus, NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UpdatePostInputDto } from './dto/input-dto/update-post.input-dto';
import { PostInputDto } from './dto/input-dto/post.input-dto';
import { GetCommentsQueryInputDto } from './dto/input-dto/get-comments-query=params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from '../../blogs/api/dto/blog.view-dto';
import { PostService } from '../application/post.service';
import { PostQueryRepository } from '../infrastructure/post.query-repository';
import { PostDocument } from '../domain/post.entity';
import { PostViewDto } from './dto/view-dto/post.view-dto';
import { GetPostQueryInputDto } from './dto/input-dto/get-posts-query-params.input-dto';

@Controller('posts')
export class PostControllers {
  constructor(
    private readonly postService: PostService,
    private readonly PostQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: GetPostQueryInputDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return await this.PostQueryRepository.getAllPosts(query);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.PostQueryRepository.getPostById(id);
  }

  @Get(':id/comments')
  async getAllCommentsForPost(@Param('id') id: string) {
    const findPost = await this.postService.findPostById(id);
    if(!findPost) throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    return {
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: [],
    };
  }

  @Post()
  async createPost(@Body() dto: PostInputDto) {
    const result = await this.postService.createPost(dto);
    return await this.PostQueryRepository.getPostById(result);
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() dto: UpdatePostInputDto) {
    return await this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }
}
