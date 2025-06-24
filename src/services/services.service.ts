import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Service } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AssignServiceDto } from './dto/assign-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getServices(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }

  async createService(dto: CreateServiceDto) {
    try {
      return this.prisma.service.create({
        data: {
          name: dto.name,
          price: dto.price,
          duration: dto.duration,
          description: dto.description,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async updateService(params: {
    id: string;
    data: Partial<CreateServiceDto>;
  }): Promise<Service> {
    try {
      const { id, data } = params;
      return await this.prisma.service.update({
        where: { id: id },
        data,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Service not found');
      }
      throw error;
    }
  }

  async deleteService(id: string) {
    try {
      const barberUsingService = await this.prisma.barberService.findFirst({
        where: {
          serviceId: id,
        },
      });

      if (barberUsingService) {
        throw new BadRequestException(
          'Service is assigned to one or more barbers',
        );
      }
      return await this.prisma.service.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Service not found');
      }
      throw error;
    }
  }

  async assignServicesToBarber(dto: AssignServiceDto) {
    const { barberId, serviceId } = dto;

    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
    });
    if (!barber) throw new NotFoundException('Barber not found');

    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceId } },
    });
    if (services.length !== serviceId.length) {
      throw new NotFoundException('One or more services not found');
    }

    const existing = await this.prisma.barberService.findMany({
      where: {
        barberId,
        serviceId: { in: serviceId },
      },
    });

    const existingIds = new Set(existing.map((e) => e.serviceId));

    const toCreate = serviceId
      .filter((id) => !existingIds.has(id))
      .map((id) => ({ barberId, serviceId: id }));

    if (toCreate.length === 0) {
      return { message: 'No new services to assign to barber' };
    }

    const result = await this.prisma.barberService.createMany({
      data: toCreate,
    });

    return { message: `${result.count} new service(s) assigned to barber` };
  }
}
