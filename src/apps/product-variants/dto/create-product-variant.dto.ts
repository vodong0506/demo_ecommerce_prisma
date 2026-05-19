import { Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { DecimalJsLike } from '@prisma/client/runtime/library';

class CreateProductVariantDto implements Prisma.ProductVariantCreateInput {
  id?: string | undefined;
  name?: string | null | undefined;
  sku?: string | null | undefined;
  price!: string | number | Prisma.Decimal | DecimalJsLike;
  stockQuantity?: number | undefined;
  attributes: unknown;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  product!: Prisma.ProductCreateNestedOneWithoutProductVariantsInput;
  productImages?:
    | Prisma.ProductImageCreateNestedManyWithoutProductVariantInput
    | undefined;
  // orderItems?:
  //   | Prisma.OrderItemCreateNestedManyWithoutProductVariantInput
  //   | undefined;
  // cartItems?:
  //   | Prisma.CartItemCreateNestedManyWithoutProductVariantInput
  //   | undefined;

  user!: UserInfo;
}

class ImportProductVariantsDto extends ImportExcel {}

export { CreateProductVariantDto, ImportProductVariantsDto };
