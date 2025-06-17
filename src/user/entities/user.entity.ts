import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  createdAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
