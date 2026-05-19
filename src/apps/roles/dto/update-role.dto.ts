import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto extends IntersectionType(
  PartialType(CreateRoleDto),
  PickType(Role, ['id']), // (Lấy duy nhất field id từ entity Role)
) {}
