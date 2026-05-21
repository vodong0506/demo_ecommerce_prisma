import { PartialType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Promotion } from '../entities/promotion.entity';

export class UpdatePromotionDto extends IntersectionType(
  PartialType(CreatePromotionDto),
  PickType(Promotion, ['id']),
) {}
