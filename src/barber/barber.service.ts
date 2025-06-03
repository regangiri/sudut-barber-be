import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBarberDto } from './dto/barber.dto';
import { Barber, Prisma } from '@prisma/client';

@Injectable()
export class BarberService {
  constructor(private prisma: PrismaService) {}

  async barbers(params: Prisma.BarberFindManyArgs): Promise<Barber[]> {
    return this.prisma.barber.findMany({
      ...params,
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
        bio: dto.bio,
      },
      include: {
        services: {
          include: { service: true },
        },
      },
    });
  }

  async deleteBarber(id: string) {
    try {
      return await this.prisma.barber.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Barber not found');
      }
    }
  }

  async updateBarber(params: {
    id: string;
    data: Partial<CreateBarberDto>;
  }): Promise<Barber> {
    try {
      const { id, data } = params;

      return await this.prisma.barber.update({
        where: { id: id },
        data,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Barber not found');
      }
      throw error;
    }
  }
}
