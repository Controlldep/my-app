export type likeCommentsDto = {
  userId: string;
  commentId: string;
  myStatus: 'Like' | 'Dislike' | 'None';
};