/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsPhoneNumber('ID', { message: 'Phone number must be valid' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;
  @IsOptional()
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
