import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UploadedFile,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExportUsersDto } from './dto/get-user.dto';
import type { GetUsersPaginationDto } from './dto/get-user.dto';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { User as UserEntity } from './entities/user.entity';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { Response } from 'express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';
import type { GetOptionsParams } from '../../common/query/options.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportUsers(
    @Query() exportUsersDto: ExportUsersDto,
    @Res() res: Response,
  ) {
    const workbook = await this.usersService.exportUsers(exportUsersDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importUsers(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.usersService.importUsers({ file, user });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getUsers(@Query() query: GetUsersPaginationDto) {
    return this.usersService.getUsers(query);
  }

  @Get('options')
  getUserOptions(@Query() query: GetOptionsParams<UserEntity>) {
    return this.usersService.getOptions(query);
  }

  @Get(':id')
  getUser(@Param('id') id: UserEntity['id']) {
    return this.usersService.getUser({ id });
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: UserEntity['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser({
      data: updateUserDto,
      where: { id },
    });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: UserEntity['id']) {
    return this.usersService.deleteUser({ id });
  }
}
