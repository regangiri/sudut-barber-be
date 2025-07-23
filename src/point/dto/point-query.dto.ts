import { IsNumberString, IsOptional } from 'class-validator';

export class PointQueryDto {
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @IsOptional()
  @IsNumberString()
  take?: string;

  @IsOptional()
  points?: number;

  @IsOptional()
  orderBy?: string;
}
