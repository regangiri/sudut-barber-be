// update-booking.dto.ts
import { IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsNotEmpty({ message: 'User ID is required' })
  userId?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Barber ID is required' })
  barberId?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Service ID is required' })
  serviceId?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Start time must be a valid ISO 8601 date string' })
  startTime?: string;

  // ❌ Do NOT include `status` at all
}
