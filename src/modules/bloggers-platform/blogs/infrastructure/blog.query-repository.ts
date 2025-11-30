import { FilterQuery, Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../api/dto/view-dto/blog.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryInputDto } from '../api/dto/input-dto/get-blogs-query-params.input-dto';
import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogById(id: string): Promise<BlogViewDto> {
    const blog = await this.blogModel.findOne({ _id: id });
    if (!blog) throw new NotFoundException('blog not found');

    return BlogViewDto.mapToView(blog);
  }

  async getAllBlogs(query: GetBlogsQueryInputDto): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const filter: FilterQuery<Blog> = {};

    if (query.searchNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchNameTerm, $options: 'i' },
      });
    }
    const sortDirection = query.sortDirection ?? SortDirection.Desc;

    const blogs = await this.blogModel
      .find(filter)
      .sort({ [query.sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);

    const items = blogs.map((blog) => BlogViewDto.mapToView(blog));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
