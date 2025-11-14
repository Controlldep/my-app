import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type FilterQuery, Model } from 'mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { PostViewDto } from '../api/dto/view-dto/post.view-dto';
import { GetPostQueryInputDto } from '../api/dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getPostById(id: string): Promise<PostViewDto> {
    const findPost = await this.postModel.findById(id);
    if (!findPost) throw new NotFoundException('Post not found');

    return PostViewDto.mapToView(findPost);
  }

  async getAllPosts(
    query: GetPostQueryInputDto,
    blogId?: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<Post> = {};

    if (blogId) {
      filter.blogId = blogId;
    }

    const posts = await this.postModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.postModel.countDocuments(filter);

    const items = posts.map((post) => PostViewDto.mapToView(post));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}