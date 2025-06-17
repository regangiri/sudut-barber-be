import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

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
