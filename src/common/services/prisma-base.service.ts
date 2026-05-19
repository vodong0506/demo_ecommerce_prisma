import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type ExtendedClient = PrismaService['extended']; // (Đây là type extraction (lấy type từ property))
export class PrismaBaseService<
  K extends keyof PrismaClient & keyof ExtendedClient,
> {
  constructor(
    protected prismaService: PrismaService,
    private readonly model: K,
  ) {}

  protected get client(): PrismaClient[K] {
    return this.prismaService[this.model]; // (this.client)
  }

  protected get extended(): ExtendedClient[K] {
    return this.prismaService.extended[this.model]; // (this.extended)
  }
}
