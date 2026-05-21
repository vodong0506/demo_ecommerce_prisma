import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Cart } from '../entities/cart.entity';

export class UpdateCartDto extends IntersectionType(
  PartialType(CreateCartDto),
  PickType(Cart, ['id']),
) {}
