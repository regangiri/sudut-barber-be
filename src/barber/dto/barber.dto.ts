import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBarberDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsOptional()
  bio: string;
  @IsOptional()
  serviceIds: string[];
}
