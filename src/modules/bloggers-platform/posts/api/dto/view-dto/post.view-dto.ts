import { PostModel } from '../../../domain/post.entity';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: any[];
  };

  // static mapToView(post: PostDocument): PostViewDto {
  //   const dto: PostViewDto = new PostViewDto();
  //   dto.id = post._id.toString();
  //   dto.title = post.title;
  //   dto.shortDescription = post.shortDescription;
  //   dto.content = post.content;
  //   dto.blogId = post.blogId;
  //   dto.blogName = post.blogName;
  //   dto.createdAt = post.createdAt;
  //   dto.extendedLikesInfo = {
  //     likesCount: 0,
  //     dislikesCount: 0,
  //     myStatus: 'None',
  //     newestLikes: [],
  //   };
  //
  //   return dto;
  // }
  static mapToView(post: PostModel, extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: any[];
  }): PostViewDto {
    const dto = new PostViewDto();

    // Маппим основные поля
    dto.id = post.id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;

    // Добавляем информацию о лайках с дефолтными значениями, если не было передано
    dto.extendedLikesInfo = {
      likesCount: extendedLikesInfo.likesCount || 0,
      dislikesCount: extendedLikesInfo.dislikesCount || 0,
      myStatus: extendedLikesInfo.myStatus || 'None',
      newestLikes: extendedLikesInfo.newestLikes || [],
    };

    return dto;
  }
}
