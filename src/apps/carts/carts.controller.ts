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
import { Cart } from '@prisma/client';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { User } from '../../common/decorators/user.decorator';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { SkipPermission } from '../auth/auth.decorator';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsPaginationDto } from './dto/get-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @SkipPermission()
  createCart(@Body() createDto: CreateCartDto, @User() user: UserInfo) {
    const userID = user?.userID;
    if (userID) {
      return this.cartsService.createCart({
        user: { connect: { id: user.userID } },
      });
    }
    return this.cartsService.createCart(createDto);
  }

  @Patch(':id')
  @SkipPermission()
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
  @SkipPermission()
  @UsePipes(ParseParamsPaginationPipe)
  getCarts(@Query() query: GetCartsPaginationDto) {
    return this.cartsService.getCarts(query);
  }

  @Get('options')
  @SkipPermission()
  getCartOptions(@Query() query: GetOptionsParams<Cart>) {
    return this.cartsService.getOptions(query);
  }

  @Get()
  @SkipPermission()
  getCart(@User() user: UserInfo) {
    return this.cartsService.getCart(user.userID);
  }

  @Delete('me')
  @SkipPermission()
  deleteMyCart(@User() user: UserInfo) {
    return this.cartsService.deleteCart({ userID: user.userID });
  }
}
