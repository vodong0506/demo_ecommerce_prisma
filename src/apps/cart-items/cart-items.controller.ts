import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { User, type UserInfo } from 'src/common/decorators/user.decorator';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { SkipPermission } from '../auth/auth.decorator';
import { CartItemsService } from './cart-items.service';
import { AddCartItemDto } from './dto/create-cart-item.dto';
import { GetCartItemsPaginationDto } from './dto/get-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cartItems')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @SkipPermission()
  addItem(
    @Body() dto: AddCartItemDto,
    @User() user: UserInfo, // ← decorator extract từ JWT token
  ) {
    return this.cartItemsService.createCartItem({
      userID: user.userID, //  — lấy từ token, không phải body
      productVariantID: dto.productVariantID,
      quantity: dto.quantity,
    });
  }

  @Patch(':id')
  @SkipPermission()
  updateCartItem(
    @Param('id') id: CartItem['id'],
    @Body() updateCartItemDto: UpdateCartItemDto,
    @User() user: UserInfo,
  ) {
    return this.cartItemsService.updateCartItem({
      data: updateCartItemDto,
      where: { id },
      userID: user.userID,
    });
  }

  @Get()
  @SkipPermission()
  @UsePipes(ParseParamsPaginationPipe)
  getCartItems(
    @Query() query: GetCartItemsPaginationDto,
    @User() user: UserInfo, // ← thêm
  ) {
    return this.cartItemsService.getCartItems({
      ...query,
      userID: user.userID,
    });
  }

  @Get('options')
  @SkipPermission()
  getCartItemOptions(@Query() query: GetOptionsParams<CartItem>) {
    return this.cartItemsService.getOptions(query);
  }

  @Get(':id')
  @SkipPermission()
  getCartItem(@Param('id') id: CartItem['id']) {
    return this.cartItemsService.getCartItem({ id });
  }

  @Delete(':id')
  @SkipPermission()
  deleteCartItem(@Param('id') id: CartItem['id'], @User() user: UserInfo) {
    return this.cartItemsService.deleteCartItem({ id }, user.userID);
  }
}
