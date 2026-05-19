import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, ImportProductsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ExportProductsDto,
  GetProductsPaginationDto,
} from './dto/get-product.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Product } from './entities/product.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class ProductsService
  extends PrismaBaseService<'product'>
  implements Options<Product>
{
  private productEntityName = Product.name;
  private excelSheets = {
    [this.productEntityName]: this.productEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
    private vendorService: VendorsService,
  ) {
    super(prismaService, 'product');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getProduct(where: Prisma.ProductWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getProducts({ page, itemPerPage }: GetProductsPaginationDto) {
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

  async createProduct(createProductDto: CreateProductDto) {
    const data = await this.extended.create({
      data: createProductDto,
    });
    return data;
  }

  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: UpdateProductDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams<Product>) {
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

  async exportProducts({ ids }: ExportProductsDto) {
    const [products, allVendors] = await Promise.all([
      this.extended.export({
        where: { id: { in: ids } },
      }),
      this.vendorService.client.findMany({
        select: { id: true, name: true },
      }),
    ]);
    const idToName = new Map<string, string>(
      allVendors.map((vendor) => [vendor.id, vendor.name]),
    );
    const mappedProducts = products.map((product) => {
      const mapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(product)) {
        if (key === 'vendorID') {
          mapped['vendorName'] = value
            ? (idToName.get(value as string) ?? null)
            : null;
        } else {
          mapped[key] = value;
        }
      }
      return mapped;
    });
    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.productEntityName],
          data: mappedProducts,
        },
      ],
    });
    return data;
  }

  async importProducts({ file, user }: ImportProductsDto) {
    const productSheetName = this.excelSheets[this.productEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const rows = dataCreated[productSheetName];
    const vendorNames = [...new Set(rows.map((r) => r.vendorName))] as string[];
    const vendors = await this.vendorService.client.findMany({
      where: { name: { in: vendorNames } },
      select: { id: true, name: true },
    });
    const vendorMap = new Map(vendors.map((v) => [v.name, v.id]));
    const data = await this.extended.createMany({
      data: rows.map(({ vendorName, ...rest }) => {
        const vendorID = vendorMap.get(vendorName);
        if (!vendorID)
          throw new BadRequestException(
            `Vendor "${vendorName}" does not exist`,
          );
        return { ...rest, vendorID, user };
      }),
    });
    return data;
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
