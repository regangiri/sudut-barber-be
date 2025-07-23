import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PointModule } from 'src/point/point.module';

@Module({
  imports: [PointModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
