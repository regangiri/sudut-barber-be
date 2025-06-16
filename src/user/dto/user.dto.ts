/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  email: string;
  phone: string;
  name?: string;
  createdAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Phone number must be valid' })
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;
  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Phone number must be valid' })
  phone?: string;
  @IsOptional()
  name?: string;
}

export class UserQueryDto {
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @IsOptional()
  @IsNumberString()
  take?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  orderBy?: string;
}
