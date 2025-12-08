import { Trim } from '../../../../../../core/decorators/trim';
import { MaxLength, MinLength } from 'class-validator';

export class CommentsInputDto {
  @Trim()
  @MinLength(20, { message: 'content must be at least 20 characters long' })
  @MaxLength(300, { message: 'content cannot be longer than 300 characters' })
  content: string;
}
