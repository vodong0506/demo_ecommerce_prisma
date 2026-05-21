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
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ExportCartItemsDto,
  GetCartItemsPaginationDto,
} from './dto/get-cart-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { CartItem } from '@prisma/client';
import { CartItemsService } from './cart-items.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('cartItems')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  createCartItem(@Body() createDto: CreateCartItemDto, @User() user) {
    return this.cartItemsService.createCartItem({ ...createDto, user });
  }

  @Patch(':id')
  updateCartItem(
    @Param('id') id: CartItem['id'],
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.updateCartItem({
      data: updateCartItemDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getCartItems(@Query() query: GetCartItemsPaginationDto) {
    return this.cartItemsService.getCartItems(query);
  }

  @Get('options')
  getCartItemOptions(@Query() query: GetOptionsParams<CartItem>) {
    return this.cartItemsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportCartItems(
    @Query() exportCartItemsDto: ExportCartItemsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.cartItemsService.exportCartItems(exportCartItemsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importCartItems(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.cartItemsService.importCartItems({ file, user });
  }

  @Get(':id')
  getCartItem(@Param('id') id: CartItem['id']) {
    return this.cartItemsService.getCartItem({ id });
  }

  @Delete(':id')
  deleteCartItem(@Param('id') id: CartItem['id']) {
    return this.cartItemsService.deleteCartItem({ id });
  }
}
