import { PartialType } from '@nestjs/swagger';
import { CreateOrderAddressDto } from './create-order-address.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { OrderAddress } from '../entities/order-address.entity';

export class UpdateOrderAddressDto extends IntersectionType(
  PartialType(CreateOrderAddressDto),
  PickType(OrderAddress, ['id']),
) {}
