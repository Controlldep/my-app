import { Injectable } from '@nestjs/common';
import { BlogInputDto } from '../api/dto/blog.input-dto';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { PostInputDto } from '../../posts/api/dto/post.input-dto';
import { BlogInputUpdateDto } from '../api/dto/blog.input-update-dto';
import { BlogRepository } from '../infrastructure/blog.repository';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    // private readonly postRepository: PostRepository
  ) {}

  async createBlog(dto: BlogInputDto) {
    const blog: BlogDocument = Blog.createInstance(dto);
    return await this.blogRepository.save(blog);
  }

  // async createPostByBlog(blogId: string, dto: PostInputDto) {
  //   const findBlog: BlogDocument | null = await this.blogRepository.findBlogById(blogId);
  //   if (!findBlog) throw new NotFoundException('Blog not found');
  //
  //   const post = Post.createInstance({
  //     ...dto,
  //     blogId,
  //     findBlog.name
  //   });
  //
  //   return await this.postRepository.save(post);
  // }

  async updateBlog(id: string, dto: BlogInputUpdateDto) {
    return await this.blogRepository.updateBlog(id, dto);
  }

  async deleteBlog(id: string) {
    return await this.blogRepository.deleteBlog(id);
  }
}
