import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { OrderAddressesController } from './order-addresses.controller';
import { OrderAddressesService } from './order-addresses.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [OrderAddressesController],
  providers: [OrderAddressesService, PaginationUtilService],
  exports: [OrderAddressesService],
})
export class OrderAddressesModule {}
