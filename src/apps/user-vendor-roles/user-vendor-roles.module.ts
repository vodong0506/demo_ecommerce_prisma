import { Module } from '@nestjs/common';
import { UserVendorRolesService } from './user-vendor-roles.service';
import { UserVendorRolesController } from './user-vendor-roles.controller';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [ExcelUtilModule, UsersModule, VendorsModule, RolesModule],
  controllers: [UserVendorRolesController],
  providers: [UserVendorRolesService],
})
export class UserVendorRolesModule {}
