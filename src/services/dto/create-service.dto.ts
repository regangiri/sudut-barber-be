import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsNotEmpty({ message: 'Price is required' })
  price: number;
  @IsNotEmpty({ message: 'Duration is required' })
  duration: number;
  @IsOptional()
  description: string | null;
}
