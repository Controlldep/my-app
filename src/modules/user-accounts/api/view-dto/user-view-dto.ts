import { UserModel } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  static mapToView(user: UserModel): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();
    return dto;
  }
}
