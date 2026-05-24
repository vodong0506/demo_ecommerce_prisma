import { Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { ImportExcel } from 'src/common/utils/excel-util/excel-util.const';

class CreateOrderItemDto implements Prisma.OrderItemCreateInput {
  id?: string | undefined;
  quantity!: number;
  unitPrice!: string | number | Prisma.Decimal | DecimalJsLike;
  totalPrice!: string | number | Prisma.Decimal | DecimalJsLike;
  productVariantSnapshot?: unknown;
  vendor!: Prisma.VendorCreateNestedOneWithoutOrderItemsInput;
  productVariant!: Prisma.ProductVariantCreateNestedOneWithoutOrderItemsInput;
  order!: Prisma.OrderCreateNestedOneWithoutOrderItemsInput;
  user!: UserInfo;
}

class ImportOrderItemsDto extends ImportExcel {}

export { CreateOrderItemDto, ImportOrderItemsDto };
