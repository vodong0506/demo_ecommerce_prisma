import { $Enums, Prisma } from '@prisma/client';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreateOrderAddressDto implements Prisma.OrderAddressCreateInput {
  id?: string | undefined;
  type!: $Enums.AddressType;
  firstName!: string;
  lastName?: string | null | undefined;
  company?: string | null | undefined;
  fullAddress!: string;
  city?: string | null | undefined;
  province?: string | null | undefined;
  country?: string | null | undefined;
  phone!: string;
  order!: Prisma.OrderCreateNestedOneWithoutOrderAddressesInput;
  user!: UserInfo;
}

class ImportOrderAddressesDto extends ImportExcel {}

export { CreateOrderAddressDto, ImportOrderAddressesDto };
