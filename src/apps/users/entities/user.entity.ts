import { $Enums, User as UserPrisma } from '@prisma/client';

// (định nghĩa lại entity User trong ứng dụng NestJS dựa trên model User của Prisma)
export class User implements UserPrisma {
  id!: string;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string | null;
  fullAddress!: string;
  city!: string | null;
  province!: string | null;
  country!: string | null;
  phone!: string | null;
  status!: $Enums.UserStatus;
  createdAt!: Date;
  createdBy!: string;
  updatedAt!: Date;
  deletedAt!: Date | null;
}
