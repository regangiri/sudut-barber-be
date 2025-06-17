import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async users(params: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany({
      ...params,
    });
  }

  async updateUser(params: { id: string; data: UpdateUserDto }): Promise<User> {
    try {
      const { id, data } = params;

      if (data.email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (existingEmail && existingEmail.id !== id) {
          throw new BadRequestException('Email already exists');
        }
      }
      if (data.phone) {
        const existingPhone = await this.prisma.user.findUnique({
          where: { phone: data.phone },
        });

        if (existingPhone && existingPhone.id !== id) {
          throw new BadRequestException('Phone number already exists');
        }
      }

      return await this.prisma.user.update({ where: { id: id }, data });
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where,
      });
    } catch (error: unknown) {
      console.log('Unexpected error during delete:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
