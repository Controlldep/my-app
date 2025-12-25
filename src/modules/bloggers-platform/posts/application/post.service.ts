import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../../blogs/infrastructure/blog.repository';
import { PostInputDto } from '../api/dto/input-dto/post.input-dto';
import { BlogModel } from '../../blogs/domain/blog.entity';
import { UpdatePostInputDto } from '../api/dto/input-dto/update-post.input-dto';
import { PostRepository } from '../infrastructure/post.repository';
import { PostModel } from '../domain/post.entity';
import { Types } from 'mongoose';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async createPost(dto: PostInputDto) {
    const findBlog: BlogModel | null = await this.blogRepository.findBlogById(dto.blogId);
    if (!findBlog) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);

    const post: PostModel = PostModel.createInstance({
      ...dto,
      blogName: findBlog.name,
    });

    return await this.postRepository.save(post);
  }

  async findPostById(id: string): Promise<PostModel | null> {
    return await this.postRepository.findPostById(id);
  }

  async updatePost(id: string, dto: UpdatePostInputDto) {
    if (dto.blogId) {
      if (!Types.ObjectId.isValid(dto.blogId)) {
        throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST);
      }
      const findBlogByDtoId = await this.blogRepository.findBlogById(dto.blogId);
      if (!findBlogByDtoId) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
    return await this.postRepository.updatePost(id, dto);
  }

  async deletePost(id: string) {
    return await this.postRepository.deletePost(id);
  }
}
