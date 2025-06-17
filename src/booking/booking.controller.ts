import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async bookings(@Query() query: any) {
    const {
      skip = 0,
      take = 10,
      id = '',
      orderBy = 'createdAt',
      status = '',
    } = query;

    const where = {
      ...(id && { id: { equals: id } }),
      ...(status && { status: { equals: status } }),
    };

    return this.bookingService.bookings({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
  }

  @Post('/create-booking')
  async createBooking(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.createBooking(dto);
  }

  @Patch('/update-booking/:id')
  async updateBooking(
    @Param('id') id: string,
    @Body() data: Partial<CreateBookingDto>,
  ): Promise<Booking> {
    return this.bookingService.updateBooking({ id: id, data });
  }

  @Delete('/delete-booking/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
