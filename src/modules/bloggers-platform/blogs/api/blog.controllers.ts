import { Body, Controller, Delete, Get, Param, Post, Put, Query, } from '@nestjs/common';
import { BlogInputDto } from './dto/blog.input-dto';
import { PostInputDto } from '../../posts/api/dto/post.input-dto';
import { BlogInputUpdateDto } from './dto/blog.input-update-dto';
import { BlogService } from '../application/blog.service';
import { BlogsQueryRepository } from '../infrastructure/blog.query-repository';
import { BlogViewDto } from './dto/blog.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryInputDto } from './dto/get-blogs-query-params.input-dto';

@Controller('blogs')
export class BlogControllers {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: GetBlogsQueryInputDto,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogQueryRepository.getAllBlogs(query);
  }

  // @Get(':id/posts')
  // async getAllPostsByBlog(@Param('id') id: string) {
  //   return await this.blogQueryRepository.getAllPostsByBlog(id);
  // }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogQueryRepository.getBlogById(id);
  }

  @Post()
  async createBlog(@Body() dto: BlogInputDto) {
    return await this.blogService.createBlog(dto);
  }

  // @Post(':id/posts')
  // async createPostByBlog(@Param('id') blogId: string, @Body() dto: PostInputDto) {
  //   return await this.blogService.createPostByBlog(blogId, dto);
  // }

  @Put(':id')
  async updateBlog(@Param('id') id: string, @Body() dto: BlogInputUpdateDto) {
    return await this.blogService.updateBlog(id, dto);
  }

  //TODO при удаление блога должны удаляться все посты

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}
