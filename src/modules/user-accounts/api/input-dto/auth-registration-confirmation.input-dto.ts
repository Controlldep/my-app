import { IsString, Length } from 'class-validator';

export class AuthRegistrationConfirmationInputDto {
  @IsString()
  @Length(4, 4, { message: 'invalid code' })
  code: string;
}
