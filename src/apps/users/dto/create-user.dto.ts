import { $Enums, Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
// (ctrl .)
export class CreateUserDto implements Prisma.UserCreateInput {
  id?: string | undefined;
  email!: string;
  password!: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  fullAddress?: string | null | undefined;
  city?: string | null | undefined;
  province?: string | null | undefined;
  country?: string | null | undefined;
  phone?: string | null | undefined;
  status?: $Enums.UserStatus | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  vendors?: Prisma.VendorCreateNestedManyWithoutUserInput | undefined;
  userSystemRoles?:
    | Prisma.UserSystemRoleCreateNestedManyWithoutUserInput
    | undefined;
  userVendorRoles?:
    | Prisma.UserVendorRoleCreateNestedManyWithoutUserInput
    | undefined;
}

export class ImportUsersDto extends ImportExcel {}
