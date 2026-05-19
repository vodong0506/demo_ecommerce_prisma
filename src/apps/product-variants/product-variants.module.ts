import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { ProductsService } from '../products/products.service';
import { VendorsService } from '../vendors/vendors.service';
import { UsersService } from '../users/users.service';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [ProductVariantsController],
  providers: [
    ProductVariantsService,
    PaginationUtilService,
    ProductsService,
    VendorsService,
    UsersService,
    StringUtilService,
  ],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
