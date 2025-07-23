import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PointTransaction, PointType, Prisma } from '@prisma/client';

@Injectable()
export class PointService {
  constructor(private prisma: PrismaService) {}

  async addPointsFromService(
    userId: string,
    bookingId: string,
    point: number,
    serviceName: string,
  ) {
    if (!point || point <= 0) return;

    return this.prisma.pointTransaction.create({
      data: {
        userId,
        bookingId,
        points: point,
        type: PointType.EARNED,
        reason: `Points from booking: ${serviceName}`,
      },
    });
  }

  async getUserPointBalance(userId: string): Promise<number> {
    const result = await this.prisma.pointTransaction.aggregate({
      _sum: {
        points: true,
      },
      where: {
        userId,
      },
    });

    return result._sum.points || 0;
  }

  async getPointHistory(
    params: Prisma.PointTransactionFindManyArgs,
  ): Promise<PointTransaction[]> {
    return this.prisma.pointTransaction.findMany({
      ...params,
    });
  }

  async addPointsToUser(
    userId: string,
    bookingId: string,
    pointsToAdd: number,
    reason: string,
  ) {
    if (pointsToAdd <= 0) return null;

    return this.prisma.pointTransaction.create({
      data: {
        userId,
        bookingId,
        points: pointsToAdd,
        type: 'EARNED',
        reason,
      },
    });
  }
}
