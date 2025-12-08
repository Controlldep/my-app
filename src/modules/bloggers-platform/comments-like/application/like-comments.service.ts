import { CommentsRepository } from '../../comments/infrastructure/comments.repository';
import { LikeCommentsRepository } from '../infrastructrure/like-comments.repository';
import { Injectable } from '@nestjs/common';
import { CommentsDocument } from '../../comments/domain/comments.entity';
import { LikeComments, LikeCommentsDocument } from '../domain/like-comments.entity';

@Injectable()
export class LikeCommentsService {
  constructor(
    private readonly likeCommentsRepository: LikeCommentsRepository,
    private readonly commentsRepository: CommentsRepository
  ) {}

  async createLikeForComments(userId: string, commentId: string) {
    const newLike: LikeCommentsDocument = LikeComments.createInstance({
      userId: userId,
      commentId: commentId,
      myStatus: 'None',
    });

    await this.likeCommentsRepository.save(newLike);
  }

  async checkStatus(id: string, commentID: string) {
    const status = await this.likeCommentsRepository.checkStatus(id, commentID);
    return status;
  }
//TODO придумать как сделать это более красиво
  async changeStatus(userId: string, comment: CommentsDocument , status: string) {
    const checkStatus = await this.likeCommentsRepository.checkStatus(userId, comment._id.toString());
    if(!checkStatus) return null
    if(checkStatus!.myStatus === status) return null

    if (checkStatus!.myStatus === "Like" && status === "Dislike") {
      comment.likesInfo.likesCount -= 1;
      comment.likesInfo.dislikesCount += 1;
    } else if (checkStatus!.myStatus === "Dislike" && status === "Like") {
      comment.likesInfo.likesCount += 1;
      comment.likesInfo.dislikesCount -= 1;
    }

    else if (status === "None") {
      if (checkStatus.myStatus === "Like") {
        comment.likesInfo.likesCount -= 1;
      } else if (checkStatus.myStatus === "Dislike") {
        comment.likesInfo.dislikesCount -= 1;
      }
    }

    else if (status === "Like") {
      comment.likesInfo.likesCount += 1;
    } else if (status === "Dislike") {
      comment.likesInfo.dislikesCount += 1;
    }

    await this.likeCommentsRepository.updateStatus(userId, comment._id.toString(), status)
    await this.commentsRepository.updateLikesInfo(comment);
  }
}
