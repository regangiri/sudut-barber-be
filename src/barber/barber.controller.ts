import { Body, Controller, Get, Post } from '@nestjs/common';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/barber.dto';

@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async barbers() {
    return this.barberService.barbers();
  }

  @Post('/create-barber')
  async createBarber(@Body() dto: CreateBarberDto) {
    return this.barberService.createBarber(dto);
  }
}
