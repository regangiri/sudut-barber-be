import { Injectable } from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
        user: true,
        service: true,
      },
    });
  }
}
