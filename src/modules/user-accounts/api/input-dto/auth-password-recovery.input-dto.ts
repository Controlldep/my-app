import { IsEmail } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim';

export class AuthPasswordRecoveryInputDto {
  @Trim()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
