import { Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { UserInfo } from '../../../common/decorators/user.decorator';

class CreatePermissionDto implements Prisma.PermissionCreateInput {
  id?: string | undefined;
  name!: string;
  description?: string | null | undefined;
  key!: string;
  isSystemPermission?: boolean | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  rolePermissions?:
    | Prisma.RolePermissionCreateNestedManyWithoutPermissionInput
    | undefined;
  user!: UserInfo;
}

class ImportPermissionsDto extends ImportExcel {}

export { CreatePermissionDto, ImportPermissionsDto };
