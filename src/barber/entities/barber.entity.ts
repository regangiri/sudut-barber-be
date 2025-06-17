export class BarberEntity {
  id: string;
  name: string;
  bio: string;
  services: any;
  reviews: any;
  bookings: any;
  createdAt: Date;

  constructor(partial: Partial<BarberEntity>) {
    Object.assign(this, partial);
  }
}
