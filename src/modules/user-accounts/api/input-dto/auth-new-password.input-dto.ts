import { Trim } from '../../../../core/decorators/trim';
import { MaxLength, MinLength } from 'class-validator';

export class AuthNewPasswordInputDto {
  @Trim()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @MaxLength(20, { message: 'password cannot be longer than 20 characters' })
  newPassword: string;
  @Trim()
  recoveryCode: string;
}
