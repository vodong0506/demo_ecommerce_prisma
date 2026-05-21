import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Cart } from '../entities/cart.entity';

class GetCartsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Cart),
) {}

class ExportCartsDto {
  ids!: NonNullable<Prisma.CartWhereUniqueInput['id']>[];
}

export { ExportCartsDto, GetCartsPaginationDto };
