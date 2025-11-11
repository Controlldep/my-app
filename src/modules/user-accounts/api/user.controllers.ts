import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersInputDto } from './input-dto/users.input-dto';
import { UserService } from '../application/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.findAllUsers();
  }

  @Post()
  async createUser(@Body() dto: UsersInputDto) {
    return await this.userService.createUser(dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
