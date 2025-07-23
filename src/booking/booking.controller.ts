import {
  BadRequestException,
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
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { BookingEntity } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private prisma: PrismaService,
  ) {}

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
    const barber = await this.prisma.barber.findUnique({
      where: { id: dto.barberId },
      include: { services: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const serviceOffered = barber?.services.some(
      (service) => service.serviceId === dto.serviceId,
    );

    if (!serviceOffered) {
      throw new BadRequestException(
        'Selected barber does not offer this service',
      );
    }
    const booking = this.bookingService.createBooking(dto);
    return plainToInstance(BookingEntity, booking);
  }

  @Patch('/update-booking/:id')
  async updateBooking(
    @Param('id') id: string,
    @Body() data: Partial<CreateBookingDto>,
  ): Promise<Booking> {
    return this.bookingService.updateBooking({ id: id, data });
  }

  @Patch('/complete-booking/:id')
  async completeBooking(@Param('id') id: string) {
    return this.bookingService.completeBooking(id);
  }

  @Delete('/delete-booking/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
