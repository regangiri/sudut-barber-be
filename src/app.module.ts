import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { BarberModule } from './barber/barber.module';
import { BarberController } from './barber/barber.controller';
import { BarberService } from './barber/barber.service';
import { BookingModule } from './booking/booking.module';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';

@Module({
  imports: [UserModule, BarberModule, BookingModule],
  controllers: [
    AppController,
    UserController,
    BarberController,
    BookingController,
  ],
  providers: [
    AppService,
    PrismaService,
    UserService,
    BarberService,
    BookingService,
  ],
})
export class AppModule {}
