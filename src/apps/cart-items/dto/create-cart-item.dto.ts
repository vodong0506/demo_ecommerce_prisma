import { Prisma } from '@prisma/client';
import { UserInfo } from '../../../common/decorators/user.decorator';

export class CreateCartItemDto implements Prisma.CartItemCreateInput {
  id?: string | undefined;
  quantity!: number;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  cart!: Prisma.CartCreateNestedOneWithoutCartItemsInput;
  productVariant!: Prisma.ProductVariantCreateNestedOneWithoutCartItemsInput;
  user!: UserInfo;
}
export class AddCartItemDto {
  productVariantID!: string;
  quantity!: number;
}
