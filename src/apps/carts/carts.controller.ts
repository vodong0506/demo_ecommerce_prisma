import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ExportCartsDto, GetCartsPaginationDto } from './dto/get-cart.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { Cart } from '@prisma/client';
import { CartsService } from './carts.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  createCart(@Body() createDto: CreateCartDto, @User() user: UserInfo) {
    const userID = user?.userID;
    if (userID) {
      createDto['userID'] = userID;
    }
    return this.cartsService.createCart(createDto);
  }

  @Patch(':id')
  updateCart(
    @Param('id') id: Cart['id'],
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartsService.updateCart({
      data: updateCartDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getCarts(@Query() query: GetCartsPaginationDto) {
    return this.cartsService.getCarts(query);
  }

  @Get('options')
  getCartOptions(@Query() query: GetOptionsParams<Cart>) {
    return this.cartsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportCarts(
    @Query() exportCartsDto: ExportCartsDto,
    @Res() res: Response,
  ) {
    const workbook = await this.cartsService.exportCarts(exportCartsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importCarts(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.cartsService.importCarts({ file, user });
  }

  @Get(':id')
  getCart(@Param('id') id: Cart['id']) {
    return this.cartsService.getCart({ id });
  }

  @Delete(':id')
  deleteCart(@Param('id') id: Cart['id']) {
    return this.cartsService.deleteCart({ id });
  }
}
