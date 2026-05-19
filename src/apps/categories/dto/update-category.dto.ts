import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto extends IntersectionType(
  PartialType(CreateCategoryDto),
  PickType(Category, ['id']),
) {}
