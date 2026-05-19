import { PartialType } from '@nestjs/swagger';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { ProductVariant } from '../entities/product-variant.entity';

export class UpdateProductVariantDto extends IntersectionType(
  PartialType(CreateProductVariantDto),
  PickType(ProductVariant, ['id']),
) {}
