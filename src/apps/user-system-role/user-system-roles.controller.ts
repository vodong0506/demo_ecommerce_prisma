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
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import type { Response } from 'express';
import { UserSystemRolesService } from './user-system-roles.service';
import { ExportUserSystemRolesDto } from './dto/get-user-system-role.dto';

@Controller('user-system-roles')
export class UserSystemRolesController {
  constructor(
    private readonly userSystemRolesService: UserSystemRolesService,
  ) {}

  @Get()
  getUserSystemRoles() {
    return this.userSystemRolesService.getUserSystemRoles();
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportUserSystemRoles(
    @Body() params: ExportUserSystemRolesDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.userSystemRolesService.exportUserSystemRoles(params);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importUserSystemRoles(@UploadedFile() file, @Req() req) {
    return this.userSystemRolesService.importUserSystemRoles({
      file,
      user: req.user,
    });
  }
}
