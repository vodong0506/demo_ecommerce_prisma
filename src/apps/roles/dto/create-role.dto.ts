import { $Enums, Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreateRoleDto implements Prisma.RoleCreateInput {
  id?: string | undefined;
  name!: string;
  description?: string | null | undefined;
  roleType?: $Enums.RoleType | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  userSystemRoles?:
    | Prisma.UserSystemRoleCreateNestedManyWithoutRoleInput
    | undefined;
  userVendorRoles?:
    | Prisma.UserVendorRoleCreateNestedManyWithoutRoleInput
    | undefined;
  rolePermissions?:
    | Prisma.RolePermissionCreateNestedManyWithoutRoleInput
    | undefined;
}

class ImportRolesDto extends ImportExcel {}

export { CreateRoleDto, ImportRolesDto };
