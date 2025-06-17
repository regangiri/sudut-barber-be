import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './entities/user.entity';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async users(@Query() query: UserQueryDto): Promise<UserEntity[]> {
    const { skip = 0, take = 10, name = '', orderBy = 'createdAt' } = query;

    const where = {
      ...(name && { name: { contains: name } }),
    };

    const users = await this.userService.users({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
    return plainToInstance(UserEntity, users);
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
