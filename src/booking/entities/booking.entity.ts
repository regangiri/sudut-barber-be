import { BookingStatus } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { BarberEntity } from 'src/barber/entities/barber.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export class BookingEntity {
  id: string;
  startTime: Date;
  status: BookingStatus;
  createdAt: Date;

  @Type(() => UserEntity)
  user: Partial<UserEntity>;

  @Type(() => BarberEntity)
  barber: Partial<BarberEntity>;

  @Type(() => ServiceEntity)
  service: Partial<ServiceEntity>;

  @Exclude()
  userId: string;

  @Exclude()
  barberId: string;

  @Exclude()
  serviceId: string;

  constructor(partial: Partial<BookingEntity>) {
    Object.assign(this, partial);
  }
}
