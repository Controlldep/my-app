import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { UsersInputDto } from './input-dto/users.input-dto';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastructure/user.query-repository';
import { UserViewDto } from './view-dto/user-view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { GetUsersQueryParams } from './view-dto/get-users-query-params';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  @Get()
  async getAllUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.userQueryRepository.getAllUsers(query);
  }

  @Post()
  async createUser(@Body() dto: UsersInputDto) {
    const createUserAndReturnId: string = await this.userService.createUser(dto);

    return await this.userQueryRepository.getUsersById(createUserAndReturnId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

}
