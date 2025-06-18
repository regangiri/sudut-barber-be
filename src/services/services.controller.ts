import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AssignServiceDto } from './dto/assign-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices() {
    return this.servicesService.getServices();
  }

  @Post('/create-service')
  async createService(@Body() dto: CreateServiceDto) {
    return this.servicesService.createService(dto);
  }

  @Delete('/delete-service/:id')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }

  @Patch('/update-service/:id')
  async updateService(
    @Param('id') id: string,
    @Body() data: Partial<CreateServiceDto>,
  ) {
    return this.servicesService.updateService({ id: id, data });
  }

  @Post('/assign-service')
  async assignServiceToBarber(
    @Body() dto: AssignServiceDto,
  ): Promise<{ message: string }> {
    return this.servicesService.assignServicesToBarber(dto);
  }
}
