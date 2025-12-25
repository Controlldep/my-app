import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from '../domain/post.entity';
import { PostViewDto } from '../api/dto/view-dto/post.view-dto';
import { GetPostQueryInputDto } from '../api/dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { LikePostModel } from '../../post-likes/domain/like-post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// @Injectable()
// export class PostQueryRepository {
//   constructor(
//     @InjectRepository(PostModel)
//     private readonly postRepository: Repository<PostModel>,
//     @InjectRepository(LikePostModel)
//     private readonly likePostRepositories: Repository<LikePostModel>,
//   ) {}
//
//   async getPostById(id: string, userId?: string) {
//     const findPost: PostDocument | null = await this.postModel.findById(id);
//     if (!findPost) throw new NotFoundException('Post not found');
//     //TODO сделать по нормальному
//     let myStatus;
//     let likeStatus;
//     if(userId) {
//       likeStatus = await this.likePostRepositories.checkStatus(userId, findPost._id.toString());
//       myStatus = likeStatus ? likeStatus.myStatus : 'None';
//     }else {
//       myStatus = "None"
//     }
//
//     const findLikesForPost = await this.likePostRepositories.findAllLikesForPost(id);
//     const post = {
//       id: findPost._id.toString(),
//       title: findPost.title,
//       shortDescription: findPost.shortDescription,
//       content: findPost.content,
//       blogId: findPost.blogId,
//       createdAt: findPost.createdAt,
//       blogName: findPost.blogName,
//       extendedLikesInfo: {
//         likesCount: findPost.extendedLikesInfo.likesCount,
//         dislikesCount: findPost.extendedLikesInfo.dislikesCount,
//         myStatus,
//         newestLikes: findLikesForPost,
//       }
//     }
//     return post;
//   }
//
//   async getAllPosts(query: GetPostQueryInputDto, userId: string | null, blogId?: string): Promise<PaginatedViewDto<PostViewDto[]>> {
//     const filter: FilterQuery<PostModel> = {};
//     if (blogId) {
//       filter.blogId = blogId;
//     }
//
//     const posts: PostDocument[] = await this.postModel
//       .find(filter)
//       .sort({ [query.sortBy]: query.sortDirection })
//       .skip(query.calculateSkip())
//       .limit(query.pageSize);
//
//     const totalCount = await this.postModel.countDocuments(filter);
//
//     //const items = posts.map((post) => PostViewDto.mapToView(post));
//     const mappedItems: PostViewDto[] = await Promise.all(posts.map(async (post) => {
//       let myStatus: string = "None";
//       if (userId) {
//         const likeStatus = await this.likePostRepositories.checkStatus(userId, post.id);
//         myStatus = likeStatus ? likeStatus.myStatus : "None";
//       }
//       const newestLikes = await this.likePostRepositories.findAllLikesForPost(post.id.toString());
//       const extendedLikesInfo = {
//         likesCount: post.extendedLikesInfo.likesCount,
//         dislikesCount: post.extendedLikesInfo.dislikesCount,
//         myStatus,
//         newestLikes
//       };
//       return PostViewDto.mapToView(post, extendedLikesInfo);
//     }));
//
//     return PaginatedViewDto.mapToView({
//       items: mappedItems,
//       totalCount,
//       page: query.pageNumber,
//       size: query.pageSize,
//     });
//   }
// }

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(LikePostModel)
    private readonly likePostRepositories: Repository<LikePostModel>,
  ) {}

  async getPostById(id: string, userId?: string) {
    const findPost = await this.postRepository.findOne({ where: { id } });
    if (!findPost) throw new NotFoundException('Post not found');

    let myStatus = "None";
    if (userId) {
      const likeStatus = await this.likePostRepositories.findOne({
        where: { userId, postId: findPost.id }
      });
      myStatus = likeStatus ? likeStatus.myStatus : "None";
    }

    const findLikesForPost = await this.likePostRepositories.find({
      where: { postId: findPost.id },
    });

    const post = {
      id: findPost.id,
      title: findPost.title,
      shortDescription: findPost.shortDescription,
      content: findPost.content,
      blogId: findPost.blogId,
      createdAt: findPost.createdAt,
      blogName: findPost.blogName,
      extendedLikesInfo: {
        likesCount: findPost.extendedLikesInfo.likesCount,
        dislikesCount: findPost.extendedLikesInfo.dislikesCount,
        myStatus,
        newestLikes: findLikesForPost,
      }
    };

    return post;
  }

  async getAllPosts(
    query: GetPostQueryInputDto,
    userId: string | null,
    blogId?: string
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const where: any = {};
    if (blogId) where.blogId = blogId;

    const [posts, totalCount] = await this.postRepository.findAndCount({
      where,
      order: { [query.sortBy]: query.sortDirection },
      skip: query.calculateSkip(),
      take: query.pageSize,
    });

    const mappedItems: PostViewDto[] = await Promise.all(posts.map(async (post) => {
      let myStatus = "None";
      if (userId) {
        const likeStatus = await this.likePostRepositories.findOne({
          where: { userId, postId: post.id }
        });
        myStatus = likeStatus ? likeStatus.myStatus : "None";
      }

      const newestLikes = await this.likePostRepositories.find({
        where: { postId: post.id },
      });

      const extendedLikesInfo = {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus,
        newestLikes
      };

      return PostViewDto.mapToView(post, extendedLikesInfo);
    }));

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
