import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [OrdersController],
  providers: [OrdersService, PaginationUtilService],
  exports: [OrdersService],
})
export class OrdersModule {}
