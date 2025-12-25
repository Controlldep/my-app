import { Injectable } from '@nestjs/common';
import { BlogModel } from '../domain/blog.entity';
import { BlogInputUpdateDto } from '../api/dto/input-dto/blog.input-update-dto';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogModel)
    private readonly blogRepository: Repository<BlogModel>,
  ) {}

  async findBlogById(id: string): Promise<BlogModel | null> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    return blog || null;
  }

  async save(dto: BlogModel): Promise<string> {
    const blog = this.blogRepository.create(dto);
    const saveBlog = await this.blogRepository.save(blog);
    return saveBlog.id.toString();
  }

  async updateBlog(id: string, dto: BlogInputUpdateDto) {
    const result = await this.blogRepository.update(id, dto);
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }

  async deleteBlog(id: string) {
    const result = await this.blogRepository.delete(id);
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }
}
