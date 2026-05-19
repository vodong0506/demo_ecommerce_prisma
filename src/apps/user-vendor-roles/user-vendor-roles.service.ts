import { BadRequestException, Injectable } from '@nestjs/common';
import { ExportUserVendorRolesDto } from './dto/get-user-vendor-role.dto';
import { ImportUserVendorRolesDto } from './dto/create-user-vendor-role.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { UserVendorRole } from './entities/user-vendor-role.entity';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Prisma } from '@prisma/client';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class UserVendorRolesService extends PrismaBaseService<'userVendorRole'> {
  private userVendorRoleEntityName = UserVendorRole.name;
  private excelSheets = {
    [this.userVendorRoleEntityName]: this.userVendorRoleEntityName,
  };
  constructor(
    public prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private vendorsService: VendorsService,
  ) {
    super(prismaService, 'userVendorRole');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  // (Export dữ liệu User–Vendor–Role ra file Excel)
  async exportUserVendorRoles(params: ExportUserVendorRolesDto) {
    const { userIDs, roleIDs, vendorIDs } = params ?? {};
    const where: Prisma.UserVendorRoleWhereInput = {};

    if (userIDs) {
      where.userID = { in: userIDs };
    }
    if (vendorIDs) {
      where.vendorID = { in: vendorIDs };
    }
    if (roleIDs) {
      where.roleID = { in: roleIDs };
    }

    const userVendorRoles = await this.extended.export({
      select: {
        user: { select: { email: true } },
        vendor: { select: { name: true } },
        role: { select: { name: true } },
      },
      where,
    });

    const mappedData =
      userVendorRoles.length > 0
        ? userVendorRoles.map(({ user, vendor, role }) => ({
            userEmail: user.email,
            vendorName: vendor.name,
            roleName: role.name,
          }))
        : [{ userEmail: '', vendorName: '', roleName: '' }];

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.userVendorRoleEntityName],
          fieldsExclude: [],
          data: mappedData,
        },
      ],
    });

    return data;
  }

  // (Import dữ liệu từ file Excel vào database)
  async importUserVendorRoles({ file, user }: ImportUserVendorRolesDto) {
    const userVendorRoleSheetName =
      this.excelSheets[this.userVendorRoleEntityName]; // (Lấy tên sheet)
    const dataCreated = await this.excelUtilService.read(file); // (Đọc file)
    const dataImport = dataCreated[userVendorRoleSheetName];

    const usersData = new Map<string, string>(); // email -> id
    const allUsers = await this.usersService.client.findMany({
      select: { id: true, email: true },
    });
    for (const user of allUsers) {
      usersData.set(user.email, user.id);
    }

    const vendorsData = new Map<string, string>(); // name -> id
    const allVendors = await this.vendorsService.client.findMany({
      select: { id: true, name: true },
    });
    for (const vendor of allVendors) {
      vendorsData.set(vendor.name, vendor.id);
    }

    const rolesData = new Map<string, string>(); // "roleName" -> id
    const allRoles = await this.rolesService.client.findMany({
      select: { id: true, name: true },
    });
    for (const role of allRoles) {
      rolesData.set(role.name, role.id);
    }
    // (Duyệt từng dòng Excel)
    const idsMapping = dataImport.map((item) => {
      const { userEmail, vendorName, roleName } = item ?? {};

      const userID = usersData.get(userEmail);
      if (!userID) {
        throw new BadRequestException(
          `User not found with email: "${userEmail}"`,
        );
      }
      const vendorID = vendorsData.get(vendorName);
      if (!vendorID) {
        throw new BadRequestException(`Vendor not found: "${vendorName}"`);
      }
      const roleKey = `${vendorID}__${roleName}`; // (Tạo roleKey)
      const roleID = rolesData.get(roleKey);
      if (!roleID) {
        throw new BadRequestException(
          `Role "${roleName}" not found in vendor "${vendorName}" (key: ${roleKey})`,
        );
      }
      return { userID, vendorID, roleID };
    });

    await this.extended.deleteMany({ where: { OR: idsMapping } }); // (XÓA những record trùng với dữ liệu sắp import)
    const data = await this.extended.createMany({
      data: idsMapping.map((item) => ({ ...item, user })),
    });
    return data;
  }

  // (Lấy danh sách mapping từ database)
  async getUserVendorRoles() {
    const data = await this.extended.findMany({
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
    // (Map để gom nhóm theo vendor)
    const vendorMap = new Map<string, { vendor: any; members: any[] }>();

    for (const { vendor, user, role } of data) {
      if (!vendorMap.has(vendor.id)) {
        vendorMap.set(vendor.id, { vendor, members: [] }); // (check vendor nếu chưa có -> tạo mới)
      }
      vendorMap.get(vendor.id)!.members.push({ user, role }); // (Thêm user+role vào vendor)
    }

    return [...vendorMap.values()];
  }
}
