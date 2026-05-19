import { $Enums, Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { DecimalJsLike } from '@prisma/client/runtime/library';

class CreateProductDto implements Prisma.ProductCreateInput {
  id?: string | undefined;
  name!: string;
  slug!: string;
  description?: string | null | undefined;
  sku?: string | null | undefined;
  price!: string | number | Prisma.Decimal | DecimalJsLike;
  stockQuantity?: number | undefined;
  status?: $Enums.ProductStatus | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  vendor!: Prisma.VendorCreateNestedOneWithoutProductsInput;
  productCategories?:
    | Prisma.ProductCategoryCreateNestedManyWithoutProductInput
    | undefined;
  productImages?:
    | Prisma.ProductImageCreateNestedManyWithoutProductInput
    | undefined;
  productVariants?:
    | Prisma.ProductVariantCreateNestedManyWithoutProductInput
    | undefined;
  user?: UserInfo;
}

class ImportProductsDto extends ImportExcel {}

export { CreateProductDto, ImportProductsDto };
