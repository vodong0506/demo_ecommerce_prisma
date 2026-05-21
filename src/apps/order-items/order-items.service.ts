import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import {
  CreateOrderItemDto,
  ImportOrderItemsDto,
} from './dto/create-order-item.dto';
import {
  ExportOrderItemsDto,
  GetOrderItemsPaginationDto,
} from './dto/get-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService
  extends PrismaBaseService<'orderItem'>
  implements Options<OrderItem>
{
  private orderItemEntityName = OrderItem.name;
  private excelSheets = {
    [this.orderItemEntityName]: this.orderItemEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
  ) {
    super(prismaService, 'orderItem');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getOrderItem(where: Prisma.OrderItemWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getOrderItems({ page, itemPerPage }: GetOrderItemsPaginationDto) {
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

  async createOrderItem(createOrderItemDto: CreateOrderItemDto) {
    const data = await this.extended.create({
      data: createOrderItemDto,
    });
    return data;
  }

  async updateOrderItem(params: {
    where: Prisma.OrderItemWhereUniqueInput;
    data: UpdateOrderItemDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(
    params: GetOptionsParams<Omit<OrderItem, 'productVariantSnapshot'>>,
  ) {
    const { limit, select, ...searchFields } = params;
    const fieldsSelect = this.queryUtil.convertFieldsSelectOption(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: Number(limit),
    });
    return data;
  }

  async exportOrderItems({ ids }: ExportOrderItemsDto) {
    const orderItems = await this.extended.export({
      where: {
        id: { in: ids },
      },
    });
    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.orderItemEntityName],
          data: orderItems,
        },
      ],
    });
    return data;
  }

  async importOrderItems({ file, user }: ImportOrderItemsDto) {
    const orderItemSheetName = this.excelSheets[this.orderItemEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[orderItemSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteOrderItem(where: Prisma.OrderItemWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
