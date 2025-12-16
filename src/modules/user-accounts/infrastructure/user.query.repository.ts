import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { UserModel } from '../domain/user.entity';
import { UserViewDto } from '../api/view-dto/user-view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import { GetUsersQueryParams } from '../api/view-dto/get-users-query-params';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const filter: FilterQuery<UserModel> = {};

    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }
    const sortDirection = query.sortDirection ?? SortDirection.Desc;

    const users = await this.userRepository.find({
      where: filter,
      order: { [query.sortBy]: sortDirection },
      skip: query.calculateSkip(),
      take: query.pageSize,
    });

    const totalCount = await this.userRepository.count({ where: filter });

    const items = users.map((user) => UserViewDto.mapToView(user));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
