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
  CreateOrderAddressDto,
  ImportOrderAddressesDto,
} from './dto/create-order-address.dto';
import {
  ExportOrderAddressesDto,
  GetOrderAddressesPaginationDto,
} from './dto/get-order-address.dto';
import { UpdateOrderAddressDto } from './dto/update-order-address.dto';
import { OrderAddress } from './entities/order-address.entity';

@Injectable()
export class OrderAddressesService
  extends PrismaBaseService<'orderAddress'>
  implements Options<OrderAddress>
{
  private orderAddressEntityName = OrderAddress.name;
  private excelSheets = {
    [this.orderAddressEntityName]: this.orderAddressEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
  ) {
    super(prismaService, 'orderAddress');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getOrderAddress(where: Prisma.OrderAddressWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getOrderAddresses({
    page,
    itemPerPage,
  }: GetOrderAddressesPaginationDto) {
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

  async createOrderAddress(createOrderAddressDto: CreateOrderAddressDto) {
    const data = await this.extended.create({
      data: createOrderAddressDto,
    });
    return data;
  }

  async updateOrderAddress(params: {
    where: Prisma.OrderAddressWhereUniqueInput;
    data: UpdateOrderAddressDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams<OrderAddress>) {
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

  async exportOrderAddresses({ ids }: ExportOrderAddressesDto) {
    const orderAddresses = await this.extended.export({
      where: {
        id: { in: ids },
      },
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.orderAddressEntityName],
          data: orderAddresses,
        },
      ],
    });

    return data;
  }

  async importOrderAddresses({ file, user }: ImportOrderAddressesDto) {
    const orderAddressSheetName = this.excelSheets[this.orderAddressEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[orderAddressSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteOrderAddress(where: Prisma.OrderAddressWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
