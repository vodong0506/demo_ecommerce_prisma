import { $Enums, Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';

class CreatePromotionDto implements Prisma.PromotionCreateInput {
  id?: string | undefined;
  code!: string;
  name!: string;
  description?: string | null | undefined;
  type!: $Enums.PromotionType;
  value!: string | number | Prisma.Decimal | DecimalJsLike;
  usageLimit?: number | null | undefined;
  startDate!: string | Date;
  endDate!: string | Date;
  status?: $Enums.PromotionStatus | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  orderPromotions?:
    | Prisma.OrderPromotionCreateNestedManyWithoutPromotionInput
    | undefined;
  user!: UserInfo;
}

class ImportPromotionsDto extends ImportExcel {}

export { CreatePromotionDto, ImportPromotionsDto };
