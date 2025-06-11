import { IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
  @IsNotEmpty({ message: 'Barber ID is required' })
  barberId: string;
  @IsNotEmpty({ message: 'Service ID is required' })
  serviceId: string;
  @IsNotEmpty({ message: 'Start time is required' })
  @IsISO8601({}, { message: 'startTime must be a valid ISO 8601 date string' })
  startTime: Date;
}
