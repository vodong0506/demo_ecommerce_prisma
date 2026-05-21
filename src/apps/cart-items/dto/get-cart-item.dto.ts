import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { CartItem } from '../entities/cart-item.entity';

class GetCartItemsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(CartItem),
) {}

class ExportCartItemsDto {
  ids: NonNullable<Prisma.CartItemWhereUniqueInput['id']>[];
}

export { GetCartItemsPaginationDto, ExportCartItemsDto };
