export class LikePostDto {
  userId: string;
  postId: string;
  login: string;
  myStatus: 'Like' | 'Dislike' | 'None';
}
