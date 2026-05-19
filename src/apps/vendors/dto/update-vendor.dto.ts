import { PartialType } from '@nestjs/swagger';
import { CreateVendorDto } from './create-vendor.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Vendor } from '../entities/vendor.entity';

export class UpdateVendorDto extends IntersectionType(
  PartialType(CreateVendorDto),
  PickType(Vendor, ['id']),
) {}
