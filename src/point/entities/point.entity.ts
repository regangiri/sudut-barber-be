export class PointEntity {
  userId: string;
  bookingId: string;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'ADJUSTMENT';
  reason: string;
  createdAt: Date;

  constructor(partial: Partial<PointEntity>) {
    Object.assign(this, partial);
  }
}
