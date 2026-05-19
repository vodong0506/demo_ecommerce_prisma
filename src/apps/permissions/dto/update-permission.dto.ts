import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Permission } from '../entities/permission.entity';

export class UpdatePermissionDto extends IntersectionType(
  PartialType(CreatePermissionDto),
  PickType(Permission, ['id']),
) {}
