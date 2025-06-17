import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/barber.dto';
import { Barber } from '@prisma/client';
import { BarberQueryDto } from './dto/barber-query.dto';

@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async barbers(@Query() query: BarberQueryDto): Promise<Barber[]> {
    const { skip = 0, take = 10, name = '', orderBy = 'createdAt' } = query;

    const where = {
      ...(name && { name: { contains: name } }),
    };

    return this.barberService.barbers({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
  }

  @Post('/create-barber')
  async createBarber(@Body() dto: CreateBarberDto) {
    return this.barberService.createBarber(dto);
  }

  @Delete('/delete-barber/:id')
  async deleteBarber(@Param('id') id: string) {
    return this.barberService.deleteBarber(id);
  }

  @Patch('/update-barber/:id')
  async updateBarber(
    @Param('id') id: string,
    @Body() data: Partial<CreateBarberDto>,
  ) {
    return this.barberService.updateBarber({ id: id, data });
  }
}
