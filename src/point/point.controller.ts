import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PointService } from './point.service';
import { PointQueryDto } from './dto/point-query.dto';
import { PointEntity } from './entities/point.entity';
import { plainToInstance } from 'class-transformer';
import { equals } from 'class-validator';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get('balance/:userId')
  async getUserPointBalance(@Param('userId') userId: string) {
    const points = await this.pointService.getUserPointBalance(userId);
    return { userId, points };
  }

  @Get('history/:userId')
  async getUserPointHistory(
    @Param('userId') userId: string,
    @Query() query: PointQueryDto,
  ): Promise<PointEntity[]> {
    const { skip = 0, take = 10, points, orderBy = 'createdAt' } = query;

    const where = {
      userId,
      ...(points != null ? { points: { equals: Number(points) } } : {}),
    };

    const users = await this.pointService.getPointHistory({
      skip: Number(skip),
      take: Number(take),
      where,
      orderBy: { [orderBy]: 'asc' },
    });

    return plainToInstance(PointEntity, users);
  }

  //   @Post('add/:userId')
  //   async addPointsToUser(
  //     @Param('userId') userId: string,
  //     @Body() dto: AddPointsDto,
  //   ) {
  //     const { bookingId, points, reason } = dto;

  //     if (points <= 0) {
  //       return { message: 'Points must be greater than zero.' };
  //     }

  //     const transaction = await this.pointService.addPointsFromService(
  //       userId,
  //       bookingId,
  //       points,
  //       reason || 'Points added',
  //     );

  //     return {
  //       message: 'Points added successfully',
  //       transaction,
  //     };
  //   }
}
