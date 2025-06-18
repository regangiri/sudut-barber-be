// assign-service.dto.ts
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class AssignServiceDto {
  @IsUUID()
  barberId: string;

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsUUID(undefined, { each: true })
  serviceId: string[];
}
