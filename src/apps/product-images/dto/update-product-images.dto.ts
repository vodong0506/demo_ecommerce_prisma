import { PartialType } from '@nestjs/mapped-types';
import { CreateProductImageDto } from './create-product-images.dto';

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
