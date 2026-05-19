import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ExcelUtilService } from 'src/common/utils/excel-util/excel-util.service';
import { PaginationUtilService } from 'src/common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from 'src/common/utils/query-util/query-util.service';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    ExcelUtilService,
    PaginationUtilService,
    StringUtilService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
