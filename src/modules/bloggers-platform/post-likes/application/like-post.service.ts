import { LikePostRepositories } from '../infrastructure/like-post.repository';
import { PostRepository } from '../../posts/infrastructure/post.repository';
import { Injectable } from '@nestjs/common';
import { LikePost, LikePostDocument } from '../domain/like-post.entity';
import { PostDocument } from '../../posts/domain/post.entity';

@Injectable()
export class LikePostService {
  constructor(
    private readonly postLikeRepositories: LikePostRepositories,
    private readonly postRepository: PostRepository,
  ) {}

  async createPostLike(userId: string, post: PostDocument, login: string) {
    const createLikePost: LikePostDocument = LikePost.createInstance({
      userId: userId,
      postId: post._id.toString(),
      login: login,
      myStatus: 'None',
    });

    return await this.postLikeRepositories.createLike(createLikePost);
  }

  async checkStatus(userId: string, postId: string){
    return await this.postLikeRepositories.checkStatus(userId, postId);
  }

  async changeStatus(userId: string, post: PostDocument, status: string) {
    const checkStatus = await this.postLikeRepositories.checkStatus(userId, post._id.toString());
    if(!checkStatus) return null
    if(checkStatus!.myStatus === status) return null

    if (checkStatus!.myStatus === "Like" && status === "Dislike") {
      post.extendedLikesInfo.likesCount -= 1;
      post.extendedLikesInfo.dislikesCount += 1;
    } else if (checkStatus!.myStatus === "Dislike" && status === "Like") {
      post.extendedLikesInfo.likesCount += 1;
      post.extendedLikesInfo.dislikesCount -= 1;
    }

    else if (status === "None") {
      if (checkStatus.myStatus === "Like") {
        post.extendedLikesInfo.likesCount -= 1;
      } else if (checkStatus.myStatus === "Dislike") {
        post.extendedLikesInfo.dislikesCount -= 1;
      }
    }

    else if (status === "Like") {
      post.extendedLikesInfo.likesCount += 1;
    } else if (status === "Dislike") {
      post.extendedLikesInfo.dislikesCount += 1;
    }

    await this.postLikeRepositories.updateStatus(userId, post._id.toString(), status);
    await this.postRepository.updateLikesInfo(post);
  }
}
