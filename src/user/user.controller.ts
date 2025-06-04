import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async users(@Query() query: UserQueryDto): Promise<UserModel[]> {
    const { skip = 0, take = 10, name = '', orderBy = 'createdAt' } = query;

    const where = {
      ...(name && { name: { contains: name } }),
    };

    return this.userService.users({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
  }

  @Post('create-user')
  async signupUser(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(createUserDto);
  }

  @Patch('update-user/:id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      id: id,
      data: updateUserDto,
    });
  }

  @Delete('delete-user/:id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: id });
  }
}
