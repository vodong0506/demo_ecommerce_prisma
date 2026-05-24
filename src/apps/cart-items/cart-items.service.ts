import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { User } from '../users/entities/user.entity';
import { GetCartItemsPaginationDto } from './dto/get-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemsService
  extends PrismaBaseService<'cartItem'>
  implements Options<CartItem>
{
  constructor(
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
  ) {
    super(prismaService, 'cartItem');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getCartItem(where: Prisma.CartItemWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getCartItems({
    page,
    itemPerPage,
    userID,
  }: GetCartItemsPaginationDto & { userID: User['id'] }) {
    const where = { cart: { userID } };
    const totalItems = await this.extended.count({ where });
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const list = await this.extended.findMany({
      where,
      skip: paging.skip,
      take: itemPerPage,
    });
    return paging.format(list);
  }

  async createCartItem({
    userID,
    productVariantID,
    quantity,
  }: {
    userID: string;
    productVariantID: string;
    quantity: number;
  }) {
    const cart = await this.prismaService.cart.upsert({
      where: { userID },
      create: { userID },
      update: {},
    });
    return this.client.upsert({
      where: {
        cartID_productVariantID: { cartID: cart.id, productVariantID },
      },
      create: { cartID: cart.id, productVariantID, quantity },
      update: { quantity },
    });
  }

  async updateCartItem(params: {
    where: Prisma.CartItemWhereUniqueInput;
    data: UpdateCartItemDto;
    userID: User['id'];
  }) {
    const { where, data: dataUpdate, userID } = params;
    const item = await this.client.findUnique({
      where,
      include: { cart: true },
    });
    if (!item || item.cart.userID !== userID) {
      throw new NotFoundException('CartItem not found');
    }
    return this.extended.update({ data: dataUpdate, where });
  }

  async getOptions(params: GetOptionsParams<CartItem>) {
    const { limit, select, ...searchFields } = params;
    const fieldsSelect = this.queryUtil.convertFieldsSelectOption(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: limit,
    });
    return data;
  }

  async deleteCartItem(
    where: Prisma.CartItemWhereUniqueInput,
    userID: User['id'],
  ) {
    // Verify item thuộc cart của user
    const item = await this.client.findUnique({
      where,
      include: { cart: true },
    });
    if (!item || item.cart.userID !== userID) {
      throw new NotFoundException('CartItem not found');
    }
    return this.client.delete({ where });
  }
}
