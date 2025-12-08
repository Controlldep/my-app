import { MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/trim';

export class UpdatePostInputDto {
  @Trim()
  @MinLength(3, { message: 'title must be at least 3 characters long' })
  @MaxLength(30, { message: 'title cannot be longer than 30 characters' })
  title: string;
  @Trim()
  @MinLength(3, { message: 'shortDescription must be at least 3 characters long' })
  @MaxLength(100, { message: 'shortDescription cannot be longer than 100 characters' })
  shortDescription: string;
  @Trim()
  @MinLength(3, { message: 'content must be at least 3 characters long' })
  @MaxLength(1000, { message: 'content cannot be longer than 1000 characters' })
  content: string;
  @Trim()
  blogId: string;
}
