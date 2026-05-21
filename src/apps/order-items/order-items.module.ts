import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, PaginationUtilService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
