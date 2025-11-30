import { Trim } from '../../../../core/decorators/trim';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class UsersInputDto {
  @Trim()
  @Matches(/^[a-zA-Z0-9_-]*$/, { message: 'Invalid login format' })
  @MinLength(3, { message: 'login must be at least 3 characters long' })
  @MaxLength(10, { message: 'login cannot be longer than 10 characters' })
  login: string;
  @Trim()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @Trim()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @MaxLength(20, { message: 'password cannot be longer than 20 characters' })
  password: string;
  confirmationCode?: string | null;
  expirationDate?: Date | null;
}
