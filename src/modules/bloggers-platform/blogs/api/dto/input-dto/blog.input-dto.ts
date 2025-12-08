import { Trim } from '../../../../../../core/decorators/trim';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class BlogInputDto {
  @Trim()
  @MinLength(3, { message: 'name must be at least 4 characters long' })
  @MaxLength(15, { message: 'name cannot be longer than 15 characters' })
  name: string;
  @Trim()
  @MinLength(10, { message: 'description must be at least 3 characters long' })
  @MaxLength(500, { message: 'description cannot be longer than 500 characters' })
  description: string;
  @Trim()
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, { message: 'Invalid URL format' })
  @MaxLength(100, { message: 'websiteUrl cannot be longer than 100 characters' })
  websiteUrl: string;
}
