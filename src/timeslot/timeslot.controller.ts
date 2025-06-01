import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { TimeSlotService } from './timeslot.service';
import { CreateTimeSlotDto } from './dto/timeslot.dto';

@Controller('time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post('/create-time-slot')
  create(@Body() createDto: CreateTimeSlotDto) {
    return this.timeSlotService.create(createDto);
  }

  @Get('barber/:barberId')
  findAllByBarber(
    @Param('barberId') barberId: string,
    @Query('date') date?: string,
  ) {
    return this.timeSlotService.findAllByBarber(barberId, date);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateTimeSlotDto>) {
    return this.timeSlotService.update(id, data);
  }
}
