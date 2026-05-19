import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVendorDto, ImportVendorsDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ExportVendorsDto,
  GetVendorsPaginationDto,
} from './dto/get-vendor.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Vendor } from './entities/vendor.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class VendorsService
  extends PrismaBaseService<'vendor'>
  implements Options<Vendor>
{
  private vendorEntityName = Vendor.name;
  private excelSheets = {
    [this.vendorEntityName]: this.vendorEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private userService: UsersService,
    private queryUtil: QueryUtilService,
  ) {
    super(prismaService, 'vendor');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getVendor(where: Prisma.VendorWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getVendors({ page, itemPerPage }: GetVendorsPaginationDto) {
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

  async createVendor(createVendorDto: CreateVendorDto) {
    const data = await this.extended.create({
      data: createVendorDto,
    });
    return data;
  }

  async updateVendor(params: {
    where: Prisma.VendorWhereUniqueInput;
    data: UpdateVendorDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  // (lấy dữ liệu linh hoạt theo query (filter + select + limit))
  async getOptions(params: GetOptionsParams<Vendor>) {
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

  async exportVendors({ ids }: ExportVendorsDto) {
    const [vendors, allUsers] = await Promise.all([
      this.extended.export({
        where: { id: { in: ids } },
      }),
      this.userService.client.findMany({
        select: { id: true, email: true },
      }),
    ]);
    const idToEmail = new Map<string, string>(
      allUsers.map((user) => [user.id, user.email]),
    );
    const mappedVendors = vendors.map((vendor) => {
      const mapped: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(vendor)) {
        if (key === 'userID') {
          mapped['userEmail'] = value
            ? (idToEmail.get(value as string) ?? null)
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
          sheetName: this.excelSheets[this.vendorEntityName],
          data: mappedVendors,
        },
      ],
    });
    return data;
  }

  // (import danh sách vendor từ file Excel vào database)
  async importVendors({ file, user }: ImportVendorsDto) {
    const vendorSheetName = this.excelSheets[this.vendorEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const allUsers = await this.userService.client.findMany({
      select: { id: true, email: true },
    });
    const emailToId = new Map<string, string>(
      allUsers.map((u) => [u.email, u.id]),
    );
    const data = await this.extended.createMany({
      data: dataCreated[vendorSheetName].map((item) => {
        const { userEmail, ...itemRemain } = item;
        const userID = emailToId.get(userEmail);
        if (!userID) {
          throw new BadRequestException(
            `User not found with email: "${userEmail}"`,
          );
        }
        return { ...itemRemain, userID, user };
      }),
    });
    return data;
  }

  async deleteVendor(where: Prisma.VendorWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
