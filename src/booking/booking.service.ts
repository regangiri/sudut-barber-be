import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async bookings(params: Prisma.BookingFindManyArgs): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      ...params,
      include: {
        barber: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: true,
      },
    });
  }

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    try {
      const { startTime, ...rest } = dto;

      const date = new Date(startTime);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid startTime date format');
      }

      const overlappedBookings = await this.prisma.booking.findMany({
        where: {
          startTime: {
            gte: new Date(date.getTime() - 60 * 60 * 1000),
            lte: new Date(date.getTime() + 60 * 60 * 1000),
          },
        },
      });

      if (overlappedBookings.length > 0) {
        throw new BadRequestException(
          'The booking time overlaps with an existing booking',
        );
      }

      return this.prisma.booking.create({
        data: {
          ...rest,
          startTime: date,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateBooking(params: {
    id: string;
    data: Partial<CreateBookingDto>;
  }): Promise<Booking> {
    try {
      const { id, data } = params;
      return await this.prisma.booking.update({
        where: { id: id },
        data: data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Booking not found');
      }
      throw error;
    }
  }
}
