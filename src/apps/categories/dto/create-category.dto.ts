import { Prisma } from '@prisma/client';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { UserInfo } from '../../../common/decorators/user.decorator';

class CreateCategoryDto implements Prisma.CategoryCreateInput {
  id?: string | undefined;
  name!: string;
  slug!: string;
  description?: string | null | undefined;
  imageUrl?: string | null | undefined;
  createdAt?: string | Date | undefined;
  createdBy?: string | null | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  parent?: Prisma.CategoryCreateNestedOneWithoutChildrenInput | undefined;
  children?: Prisma.CategoryCreateNestedManyWithoutParentInput | undefined;
  productCategories?:
    | Prisma.ProductCategoryCreateNestedManyWithoutCategoryInput
    | undefined;
  user!: UserInfo;
}

class ImportCategoriesDto extends ImportExcel {}

export { CreateCategoryDto, ImportCategoriesDto };
