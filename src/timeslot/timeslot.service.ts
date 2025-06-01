import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/timeslot.dto';

@Injectable()
export class TimeSlotService {
  constructor(private prisma: PrismaService) {}

  async create(createTimeSlotDto: CreateTimeSlotDto) {
    const { barberId, date, startTime, duration } = createTimeSlotDto;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    // get all slots for barber on that date where startTime < end
    const possibleConflicts = await this.prisma.timeSlot.findMany({
      where: {
        barberId,
        date: new Date(date),
        startTime: {
          lt: end,
        },
      },
    });

    // Check for any overlap
    for (const slot of possibleConflicts) {
      const slotStart = slot.startTime;
      const slotEnd = new Date(slotStart.getTime() + slot.duration * 60000);

      // if slotEnd > new startTime => overlap
      if (slotEnd > start) {
        throw new BadRequestException('Time slot overlaps with existing slot');
      }
    }

    return this.prisma.timeSlot.create({
      data: createTimeSlotDto,
    });
  }

  async findAllByBarber(barberId: string, date?: string) {
    return this.prisma.timeSlot.findMany({
      where: {
        barberId,
        ...(date && {
          date: new Date(date),
        }),
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async update(id: string, data: Partial<CreateTimeSlotDto>) {
    return this.prisma.timeSlot.update({
      where: { id },
      data,
    });
  }
}
