import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogInputDto } from './dto/input-dto/blog.input-dto';
import { PostInputDto } from '../../posts/api/dto/input-dto/post.input-dto';
import { BlogInputUpdateDto } from './dto/input-dto/blog.input-update-dto';
import { BlogService } from '../application/blog.service';
import { BlogsQueryRepository } from '../infrastructure/blog.query-repository';
import { BlogViewDto } from './dto/view-dto/blog.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryInputDto } from './dto/input-dto/get-blogs-query-params.input-dto';
import { PostQueryRepository } from '../../posts/infrastructure/post.query-repository';
import { GetPostQueryInputDto } from '../../posts/api/dto/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/api/dto/view-dto/post.view-dto';
import { BlogDocument } from '../domain/blog.entity';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';

@Controller('blogs')
export class BlogControllers {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryRepository: BlogsQueryRepository,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: GetBlogsQueryInputDto): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogQueryRepository.getAllBlogs(query);
  }

  @Get(':id/posts')
  async getAllPostsByBlog(@Query() query: GetPostQueryInputDto, @Param('id') id: string): Promise<PaginatedViewDto<PostViewDto[]>> {
    const findBlog: BlogDocument | null = await this.blogService.findBlogById(id);
    if (!findBlog) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    return this.postQueryRepository.getAllPosts(query, id);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogQueryRepository.getBlogById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() dto: BlogInputDto) {
    const createPostAndReturnId: string = await this.blogService.createBlog(dto);

    return await this.blogQueryRepository.getBlogById(createPostAndReturnId);
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async createPostByBlog(@Param('id') blogId: string, @Body() dto: PostInputDto) {
    const cretePostByBlogAndReturnId = await this.blogService.createPostByBlog(blogId, dto);
    return this.postQueryRepository.getPostById(cretePostByBlogAndReturnId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() dto: BlogInputUpdateDto) {
    return await this.blogService.updateBlog(id, dto);
  }

  //TODO при удаление блога должны удаляться все посты

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}
