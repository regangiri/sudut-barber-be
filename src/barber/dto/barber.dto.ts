import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateBarberDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsOptional()
  @Length(10, 100, { message: 'Bio must be between 10 and 100 characters' })
  bio: string;
  @IsOptional()
  serviceIds: string[];
}

export class BarberQueryDto {
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
