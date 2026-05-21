import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { OrderItem } from '../entities/order-item.entity';

export class UpdateOrderItemDto extends IntersectionType(
  PartialType(CreateOrderItemDto),
  PickType(OrderItem, ['id']),
) {}
