import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { OrderAddress } from '../entities/order-address.entity';

class GetOrderAddressesPaginationDto extends IntersectionType(
  Pagination,
  PartialType(OrderAddress),
) {}

class ExportOrderAddressesDto {
  ids!: NonNullable<Prisma.OrderAddressWhereUniqueInput['id']>[];
}

export { ExportOrderAddressesDto, GetOrderAddressesPaginationDto };
