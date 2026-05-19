import { Prisma } from '@prisma/client';
import { User } from '../entities/user.entity';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Pagination } from 'src/common/utils/pagination-util/pagination-util.interface';

// (Dùng để xuất dữ liệu user theo danh sách ID.)
class ExportUsersDto {
  ids?: NonNullable<Prisma.UserWhereUniqueInput['id']>[];
}

// (kiểm tra xem một user có quyền với một permissionKey cụ thể hay không.)
class IsExistPermissionKeyDto {
  userID?: User['id'];
  permissionKey?: string;
}

class GetUsersPaginationDto extends IntersectionType(
  Pagination,
  PartialType(User), // (filter)
) {}

export { ExportUsersDto, IsExistPermissionKeyDto, GetUsersPaginationDto };
