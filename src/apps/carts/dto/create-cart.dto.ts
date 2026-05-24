import { Prisma } from '@prisma/client';

export class CreateCartDto implements Prisma.CartCreateInput {
  id?: string | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  user!: Prisma.UserCreateNestedOneWithoutCartInput;
  cartItems?: Prisma.CartItemCreateNestedManyWithoutCartInput | undefined;
}
