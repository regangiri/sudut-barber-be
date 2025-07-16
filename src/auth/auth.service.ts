import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials email');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials password');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    return { access_token: token, user };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, phone, password, ...rest } = createUserDto;

      if (email && !password) {
        throw new BadRequestException('Password is required');
      }

      let hashedPassword: string | undefined = undefined;

      hashedPassword = await bcrypt.hash(password, 10);

      if (email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingEmail) {
          throw new BadRequestException('Email already exists');
        }
      }

      if (phone) {
        const existingPhone = await this.prisma.user.findUnique({
          where: { phone },
        });
        if (existingPhone) {
          throw new BadRequestException('Phone number already exists');
        }
      }

      return this.prisma.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          ...rest,
        },
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
