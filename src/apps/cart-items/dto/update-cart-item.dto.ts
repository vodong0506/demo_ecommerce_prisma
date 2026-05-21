import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { CartItem } from '../entities/cart-item.entity';

export class UpdateCartItemDto extends IntersectionType(
  PartialType(CreateCartItemDto),
  PickType(CartItem, ['id']),
) {}
