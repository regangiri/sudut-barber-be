import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBarberDto } from './dto/barber.dto';

@Injectable()
export class BarberService {
  constructor(private prisma: PrismaService) {}

  async barbers() {
    return this.prisma.barber.findMany({
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async createBarber(dto: CreateBarberDto) {
    return this.prisma.barber.create({
      data: {
        name: dto.name,
        services: {
          create: dto.serviceIds.map((serviceId) => ({
            service: { connect: { id: serviceId } },
          })),
        },
      },
      include: {
        services: {
          include: { service: true },
        },
      },
    });
  }
}
