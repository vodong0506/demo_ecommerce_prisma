import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateProductVariantDto,
  ImportProductVariantsDto,
} from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import {
  ExportProductVariantsDto,
  GetProductVariantsPaginationDto,
} from './dto/get-product-variant.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { ProductVariant } from './entities/product-variant.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { ProductsService } from '../products/products.service';
import { parseAttributes } from 'src/common/utils/data-format/data-fomat.util';

@Injectable()
export class ProductVariantsService
  extends PrismaBaseService<'productVariant'>
  implements Options<ProductVariant>
{
  private productVariantEntityName = ProductVariant.name;
  private excelSheets = {
    [this.productVariantEntityName]: this.productVariantEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
    private productService: ProductsService,
  ) {
    super(prismaService, 'productVariant');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getProductVariant(where: Prisma.ProductVariantWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getProductVariants({
    page,
    itemPerPage,
  }: GetProductVariantsPaginationDto) {
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

  async createProductVariant(createProductVariantDto: CreateProductVariantDto) {
    const data = await this.extended.create({
      data: createProductVariantDto,
    });
    return data;
  }

  async updateProductVariant(params: {
    where: Prisma.ProductVariantWhereUniqueInput;
    data: UpdateProductVariantDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(
    params: GetOptionsParams<Omit<ProductVariant, 'attributes'>>,
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

  async exportProductVariants({ ids }: ExportProductVariantsDto) {
    const [productVariants, allProducts] = await Promise.all([
      this.extended.export({
        where: { id: { in: ids } },
      }),
      this.productService.client.findMany({
        select: { id: true, name: true },
      }),
    ]);
    const idToName = new Map<string, string>(
      allProducts.map((product) => [product.id, product.name]),
    );
    const mappedProductVariants = productVariants.map((variant) => {
      const mapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(variant)) {
        if (key === 'productID') {
          mapped['productName'] = value
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
          sheetName: this.excelSheets[this.productVariantEntityName],
          data: mappedProductVariants,
        },
      ],
    });
    return data;
  }

  async importProductVariants({ file, user }: ImportProductVariantsDto) {
    const sheetName = this.excelSheets[this.productVariantEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const rows = dataCreated[sheetName];
    // (Lấy danh sách productName)
    const productNames = [
      ...new Set(rows.map((r) => r.productName)),
    ] as string[];
    // (Query product)
    const products = await this.productService.client.findMany({
      where: { name: { in: productNames } },
      select: { id: true, name: true },
    });
    const nameToID = new Map<string, string>(
      products.map((p) => [p.name, p.id]),
    );
    //  (Map data + parse attributes)
    const data = await this.extended.createMany({
      data: rows.map(({ productName, attributes, ...rest }) => {
        const productID = nameToID.get(productName);

        if (!productID) {
          throw new BadRequestException(
            `Product "${productName}" does not exist`,
          );
        }
        return {
          ...rest,
          productID,
          createdBy: user.userID,
          // (convert string → JSON)
          attributes: parseAttributes(attributes),
        };
      }),
      skipDuplicates: true,
    });
    return data;
  }

  async deleteProductVariant(where: Prisma.ProductVariantWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
