import { Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreateCartDto implements Prisma.CartCreateInput {
  id?: string | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  user!: Prisma.UserCreateNestedOneWithoutCartInput;
  cartItems?: Prisma.CartItemCreateNestedManyWithoutCartInput | undefined;
}

class ImportCartsDto extends ImportExcel {}

export { CreateCartDto, ImportCartsDto };
