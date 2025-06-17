import { IsNumberString, IsOptional } from 'class-validator';

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
