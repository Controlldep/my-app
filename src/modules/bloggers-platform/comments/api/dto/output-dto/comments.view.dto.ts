import { CommentsModel } from '../../../domain/comments.entity';

export class CommentsViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  static mapToView(comment: CommentsModel, myStatus: string = 'None'): CommentsViewDto {
    const dto: CommentsViewDto = new CommentsViewDto();
    dto.id = comment.id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = comment.commentatorInfo;
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus,
    };

    return dto;
  }
}


export const mapCommentToViewModel = (
  comment: CommentsModel,
  myStatus: string = "None"
): CommentsViewDto => ({
  id: comment.id.toString(),
  content: comment.content,
  commentatorInfo: comment.commentatorInfo,
  createdAt: comment.createdAt.toISOString(),
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.dislikesCount,
    myStatus,
  },
});
