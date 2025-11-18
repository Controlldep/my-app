import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from '../../blogs/infrastructure/blog.repository';
import { PostInputDto } from '../api/dto/input-dto/post.input-dto';
import { BlogDocument } from '../../blogs/domain/blog.entity';
import { UpdatePostInputDto } from '../api/dto/input-dto/update-post.input-dto';
import { PostRepository } from '../infrastructure/post.repository';
import { Post, PostDocument } from '../domain/post.entity';
import { Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async createPost(dto: PostInputDto) {
    const findBlog: BlogDocument | null = await this.blogRepository.findBlogById(dto.blogId);
    if (!findBlog) throw new NotFoundException('Blog not found');

    const post: PostDocument = Post.createInstance({
      ...dto,
      blogName: findBlog.name,
    });

    return await this.postRepository.save(post);
  }

  async findPostById(id: string): Promise<PostDocument | null> {
    return await this.postRepository.findPostById(id);
  }

  async updatePost(id: string, dto: UpdatePostInputDto) {
    if(dto.blogId) {
      if (!Types.ObjectId.isValid(dto.blogId)) {
        throw new BadRequestException('Invalid ID format');
      }
      const findBlogByDtoId = await this.blogRepository.findBlogById(dto.blogId)
      if(!findBlogByDtoId) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return await this.postRepository.updatePost(id, dto);
  }

  async deletePost(id: string) {
    return await this.postRepository.deletePost(id);
  }
}
