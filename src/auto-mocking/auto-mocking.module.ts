import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Module, ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockMetadata } from 'jest-mock';
import { PrismaService } from 'src/common/prisma/prisma.service';

const moduleMocker = new ModuleMocker(global);

@Module({})
export class AutoMockingModule {
  static async createTestingModule(metadata: ModuleMetadata) {
    return await Test.createTestingModule(metadata)
      .useMocker((instance) => {
        if (typeof instance === 'function') {
          if (instance.name === PrismaService.name) {
            return new (instance as any)();
          }

          const mockMetadata = moduleMocker.getMetadata(
            instance,
          ) as MockMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }

        if (instance === CACHE_MANAGER) {
          return {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
          } as unknown as Cache;
        }
      })
      .compile();
  }
}
