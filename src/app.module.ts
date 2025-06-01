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
import { TimeslotModule } from './timeslot/timeslot.module';
import { TimeSlotController } from './timeslot/timeslot.controller';
import { TimeSlotService } from './timeslot/timeslot.service';

@Module({
  imports: [UserModule, BarberModule, TimeslotModule],
  controllers: [
    AppController,
    UserController,
    BarberController,
    TimeSlotController,
  ],
  providers: [
    AppService,
    PrismaService,
    UserService,
    BarberService,
    TimeSlotService,
  ],
})
export class AppModule {}
