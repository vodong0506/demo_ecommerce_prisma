import { $Enums, Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreateVendorDto implements Prisma.VendorCreateInput {
  id?: string | undefined;
  name!: string;
  slug!: string;
  description?: string | null | undefined;
  logoUrl?: string | null | undefined;
  taxCode?: string | null | undefined;
  totalProducts?: number | undefined;
  totalOrders?: number | undefined;
  status?: $Enums.VendorStatus | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  user!: Prisma.UserCreateNestedOneWithoutVendorsInput;
  products?: Prisma.ProductCreateNestedManyWithoutVendorInput | undefined;
  userVendorRoles?:
    | Prisma.UserVendorRoleCreateNestedManyWithoutVendorInput
    | undefined;
  orderItems?: Prisma.OrderItemCreateNestedManyWithoutVendorInput | undefined;
}

class ImportVendorsDto extends ImportExcel {}

export { CreateVendorDto, ImportVendorsDto };
