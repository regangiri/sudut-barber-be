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

@Module({
  imports: [UserModule, BarberModule],
  controllers: [AppController, UserController, BarberController],
  providers: [AppService, PrismaService, UserService, BarberService],
})
export class AppModule {}
