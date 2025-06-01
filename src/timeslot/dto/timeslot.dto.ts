import { IsString, IsDateString, IsInt, IsBoolean } from 'class-validator';

export class CreateTimeSlotDto {
  @IsString()
  barberId: string;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsInt()
  duration: number;

  @IsBoolean()
  isBooked: boolean;
}
