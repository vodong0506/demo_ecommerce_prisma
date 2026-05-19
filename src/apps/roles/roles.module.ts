import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { VendorsService } from '../vendors/vendors.service';
import { UsersService } from '../users/users.service';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [RolesController],
  providers: [RolesService, PaginationUtilService],
  exports: [RolesService],
})
export class RolesModule {}
