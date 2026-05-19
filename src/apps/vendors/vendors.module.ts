import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [VendorsController],
  providers: [
    VendorsService,
    PaginationUtilService,
    UsersService,
    StringUtilService,
  ],
  exports: [VendorsService],
})
export class VendorsModule {}
