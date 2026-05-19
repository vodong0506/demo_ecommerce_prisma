import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { VendorsService } from '../vendors/vendors.service';
import { UsersService } from '../users/users.service';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PaginationUtilService,
    VendorsService,
    UsersService,
    StringUtilService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
