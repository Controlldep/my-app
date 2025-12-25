import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { UserModel } from '../domain/user.entity';
import { UserViewDto } from '../api/view-dto/user-view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import { GetUsersQueryParams } from '../api/view-dto/get-users-query-params';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async getUsersById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('users not found');

    return UserViewDto.mapToView(user);
  }

  async getAllUsers(query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
    const qb = this.userRepository.createQueryBuilder('user');

    if (query.searchLoginTerm || query.searchEmailTerm) {
      qb.where(
        new Brackets((qb1) => {
          if (query.searchLoginTerm) {
            qb1.orWhere('user.login ILIKE :login', {
              login: `%${query.searchLoginTerm}%`,
            });
          }
          if (query.searchEmailTerm) {
            qb1.orWhere('user.email ILIKE :email', {
              email: `%${query.searchEmailTerm}%`,
            });
          }
        }),
      );
    }

    const sortableFields = ['login', 'email', 'createdAt', 'id', 'isConfirmed'];
    const sortBy = sortableFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    if (['login', 'email'].includes(sortBy)) {
      qb.orderBy(`user.${sortBy} COLLATE "C"`, sortDirection);
    } else {
      qb.orderBy(`user.${sortBy}`, sortDirection);
    }

    qb.skip(query.calculateSkip()).take(query.pageSize);

    const [users, totalCount] = await qb.getManyAndCount();

    const items = users.map((user) => UserViewDto.mapToView(user));
    const pagesCount = Math.ceil(totalCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }
}
