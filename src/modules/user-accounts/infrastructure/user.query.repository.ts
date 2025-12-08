import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { UserViewDto } from '../api/view-dto/user-view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import { GetUsersQueryParams } from '../api/view-dto/get-users-query-params';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsersById(id: string) {
    const blog = await this.userModel.findOne({ _id: id });
    if (!blog) throw new NotFoundException('users not found');

    return UserViewDto.mapToView(blog);
  }

  async getAllUsers(query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: FilterQuery<User> = {};

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

    const users = await this.userModel
      .find(filter)
      .sort({ [query.sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.userModel.countDocuments(filter);

    const items = users.map((user) => UserViewDto.mapToView(user));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
