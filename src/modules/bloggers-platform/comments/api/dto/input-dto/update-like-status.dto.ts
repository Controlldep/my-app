import { Trim } from '../../../../../../core/decorators/trim';

export class UpdateLikeStatusDto {
  @Trim()
  likeStatus: 'Like' | 'Dislike' | 'None';
}
