import { Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { File } from '../../../common/utils/excel-util/dto/excel-util.interface';
import { UserInfo } from '../../../common/decorators/user.decorator';

export class CreateProductImageDto implements Prisma.ProductImageCreateInput {
  id?: string | undefined;
  name!: string;
  description?: string | null | undefined;
  imageUrl!: string;
  sortOrder?: number | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  product?: Prisma.ProductCreateNestedOneWithoutProductImagesInput | undefined;
  user!: UserInfo;
}

export class ImportProductImagesDto extends ImportExcel {}
export class UploadProductImagesDto {
  files!: File[];
  user!: UserInfo;
}
