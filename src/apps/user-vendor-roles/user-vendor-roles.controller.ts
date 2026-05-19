import {
  Controller,
  Body,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { UserVendorRolesService } from './user-vendor-roles.service';
import { ExportUserVendorRolesDto } from './dto/get-user-vendor-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import type { Response } from 'express';

@Controller('user-vendor-roles')
export class UserVendorRolesController {
  constructor(
    private readonly userVendorRolesService: UserVendorRolesService,
  ) {}

  @Get()
  getUserVendorRoles() {
    return this.userVendorRolesService.getUserVendorRoles();
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportUserVendorRoles(
    @Body() params: ExportUserVendorRolesDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.userVendorRolesService.exportUserVendorRoles(params);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importUserVendorRoles(@UploadedFile() file, @Req() req) {
    return this.userVendorRolesService.importUserVendorRoles({
      file,
      user: req.user,
    });
  }
}
