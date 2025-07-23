import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './entities/booking.entity';
import { PointService } from 'src/point/point.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private pointService: PointService,
  ) {}

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

  async createBooking(dto: CreateBookingDto): Promise<BookingEntity> {
    try {
      const { startTime, serviceId, barberId, ...rest } = dto;

      const start = new Date(startTime);
      if (isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startTime date format');
      }

      // 1. Fetch service to get duration
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        throw new BadRequestException('Service not found');
      }

      const durationMs = service.duration * 60 * 1000;
      const end = new Date(start.getTime() + durationMs);

      // 2. Fetch ALL bookings for the same barber that could overlap
      const existingBookings = await this.prisma.booking.findMany({
        where: {
          barberId,
          startTime: {
            lt: end, // Existing booking starts before new booking ends
          },
        },
        include: {
          service: true,
        },
      });

      // 3. Filter for true overlaps
      for (const booking of existingBookings) {
        const bookingStart = booking.startTime;
        const bookingEnd = new Date(
          bookingStart.getTime() + booking.service.duration * 60000,
        );

        const overlaps = bookingEnd > start;
        if (overlaps) {
          throw new BadRequestException(
            `This time slot overlaps with another booking (${bookingStart.toISOString()} - ${bookingEnd.toISOString()})`,
          );
        }
      }

      // 4. Create booking
      return this.prisma.booking.create({
        data: {
          ...rest,
          startTime: start,
          serviceId,
          barberId,
        },
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

  async completeBooking(bookingId: string) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
      include: {
        user: true,
        service: true, // includes point
      },
    });

    const points = booking.service.point ?? 0;

    await this.pointService.addPointsFromService(
      booking.userId,
      booking.id,
      points,
      booking.service.name,
    );

    return booking;
  }

  async deleteBooking(id: string) {
    try {
      return await this.prisma.booking.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Booking not found');
      }
    }
  }
}
