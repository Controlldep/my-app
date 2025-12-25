import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../api/dto/view-dto/blog.view-dto';
import { BlogModel } from '../domain/blog.entity';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryInputDto } from '../api/dto/input-dto/get-blogs-query-params.input-dto';
import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(BlogModel)
    private readonly blogsQueryRepository: Repository<BlogModel>,
  ) {}

  async getBlogById(id: string): Promise<BlogViewDto> {
    const blog = await this.blogsQueryRepository.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('blog not found');

    return BlogViewDto.mapToView(blog);
  }

  async getAllBlogs(query: GetBlogsQueryInputDto): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const where: FindOptionsWhere<BlogModel> = {};

    if (query.searchNameTerm) {
      where.name = ILike(`%${query.searchNameTerm}%`);
    }

    const sortDirection = query.sortDirection ?? SortDirection.Desc;

    const [blogs, totalCount] = await this.blogsQueryRepository.findAndCount({
      where,
      order: { [query.sortBy]: sortDirection },
      skip: query.calculateSkip(),
      take: query.pageSize,
    });

    const items = blogs.map((blog) => BlogViewDto.mapToView(blog));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
