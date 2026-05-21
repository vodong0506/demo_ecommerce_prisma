import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { OrderItem } from '../entities/order-item.entity';

class GetOrderItemsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(OrderItem),
) {}

class ExportOrderItemsDto {
  ids!: NonNullable<Prisma.OrderItemWhereUniqueInput['id']>[];
}

export { ExportOrderItemsDto, GetOrderItemsPaginationDto };
