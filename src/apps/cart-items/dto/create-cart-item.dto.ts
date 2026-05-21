import { Prisma } from '@prisma/client';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreateCartItemDto implements Prisma.CartItemCreateInput {
  id?: string | undefined;
  quantity!: number;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  cart!: Prisma.CartCreateNestedOneWithoutCartItemsInput;
  productVariant!: Prisma.ProductVariantCreateNestedOneWithoutCartItemsInput;
  user!: UserInfo;
}

class ImportCartItemsDto extends ImportExcel {}

export { CreateCartItemDto, ImportCartItemsDto };
