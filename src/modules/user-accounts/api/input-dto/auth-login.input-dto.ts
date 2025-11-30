import { IsEmail, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim';

export class AuthLoginInputDto {
  @IsString()
  loginOrEmail: string;
  @Trim()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @MaxLength(20, { message: 'password cannot be longer than 20 characters' })
  password: string;
}
