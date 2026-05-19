import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class UpdateProductDto extends IntersectionType(
  PartialType(CreateProductDto),
  PickType(Product, ['id']),
) {}
