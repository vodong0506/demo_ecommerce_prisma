import { Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreateOrderItemDto implements Prisma.OrderItemCreateInput {
  id?: string | undefined;
  quantity!: number;
  unitPrice!: string | number | Prisma.Decimal | DecimalJsLike;
  totalPrice!: string | number | Prisma.Decimal | DecimalJsLike;
  productVariantSnapshot?:
    | PrismaJson.ProductVariantSnapshotType
    | Prisma.NullableJsonNullValueInput
    | undefined;
  productVariant!: Prisma.ProductVariantCreateNestedOneWithoutOrderItemsInput;
  order!: Prisma.OrderCreateNestedOneWithoutOrderItemsInput;
  user!: UserInfo;
}

class ImportOrderItemsDto extends ImportExcel {}

export { CreateOrderItemDto, ImportOrderItemsDto };
