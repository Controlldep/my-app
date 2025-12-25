import { Injectable } from '@nestjs/common';
import { BlogInputDto } from '../api/dto/input-dto/blog.input-dto';
import { BlogModel } from '../domain/blog.entity';
import { PostInputDto } from '../../posts/api/dto/input-dto/post.input-dto';
import { BlogInputUpdateDto } from '../api/dto/input-dto/blog.input-update-dto';
import { BlogRepository } from '../infrastructure/blog.repository';
import { PostModel } from '../../posts/domain/post.entity';
import { PostRepository } from '../../posts/infrastructure/post.repository';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async createBlog(dto: BlogInputDto) {
    const blog: BlogModel = BlogModel.createInstance(dto);
    return await this.blogRepository.save(blog);
  }

  async createPostByBlog(blogId: string, dto: PostInputDto) {
    const findBlog: BlogModel | null = await this.blogRepository.findBlogById(blogId);
    if (!findBlog) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const post: PostModel = PostModel.createInstance({
      ...dto,
      blogId: blogId,
      blogName: findBlog.name,
    });

    return await this.postRepository.save(post);
  }

  async findBlogById(id: string) {
    return await this.blogRepository.findBlogById(id);
  }

  async updateBlog(id: string, dto: BlogInputUpdateDto) {
    return await this.blogRepository.updateBlog(id, dto);
  }

  async deleteBlog(id: string) {
    return await this.blogRepository.deleteBlog(id);
  }
}
