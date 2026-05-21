import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [CartsController],
  providers: [CartsService, PaginationUtilService],
  exports: [CartsService],
})
export class CartsModule {}
