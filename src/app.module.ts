import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BarberModule } from './barber/barber.module';
import { AuthModule } from './auth/auth.module';
import { ServicesService } from './services/services.service';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [BookingModule, PrismaModule, UserModule, BarberModule, AuthModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService, ServicesService],
})
export class AppModule {}
