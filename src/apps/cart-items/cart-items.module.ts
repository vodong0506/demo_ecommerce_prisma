import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [CartItemsController],
  providers: [CartItemsService, PaginationUtilService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
