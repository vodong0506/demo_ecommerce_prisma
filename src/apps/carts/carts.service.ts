import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsPaginationDto } from './dto/get-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService
  extends PrismaBaseService<'cart'>
  implements Options<Cart>
{
  constructor(
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
  ) {
    super(prismaService, 'cart');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getCart(userID: string) {
    return this.extended.findUnique({
      where: { userID },
      include: { cartItems: true }, // ← trả về luôn items
    });
  }

  async getCarts({ page, itemPerPage }: GetCartsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const list = await this.extended.findMany({
      skip: paging.skip,
      take: itemPerPage,
    });

    const data = paging.format(list);
    return data;
  }

  async createCart(createCartDto: CreateCartDto) {
    const data = await this.extended.create({
      data: createCartDto,
    });
    return data;
  }

  async updateCart(params: {
    where: Prisma.CartWhereUniqueInput;
    data: UpdateCartDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams<Cart>) {
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

  async deleteCart(where: Prisma.CartWhereUniqueInput) {
    const data = await this.client.delete({ where });
    return data;
  }
}
