import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { ImportUserVendorRolesDto } from './dto/create-user-vendor-role.dto';
import { ExportUserVendorRolesDto } from './dto/get-user-vendor-role.dto';
import { UserVendorRole } from './entities/user-vendor-role.entity';

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
      this.excelSheets[this.userVendorRoleEntityName];

    const dataCreated = await this.excelUtilService.read(file);
    const dataImport = dataCreated[userVendorRoleSheetName];

    const [allUsers, allVendors, allRoles] = await Promise.all([
      this.usersService.client.findMany({ select: { id: true, email: true } }),
      this.vendorsService.client.findMany({ select: { id: true, name: true } }),
      this.rolesService.client.findMany({ select: { id: true, name: true } }),
    ]);

    const userMap = new Map(allUsers.map((u) => [u.email, u.id])); // email   → userID
    const vendorMap = new Map(allVendors.map((v) => [v.name, v.id])); // name    → vendorID
    const roleMap = new Map(allRoles.map((r) => [r.name, r.id])); // roleName → roleID

    const idsMapping = dataImport.map((item) => {
      const { userEmail, vendorName, roleName } = item ?? {};

      const userID = userMap.get(userEmail);
      if (!userID) {
        throw new BadRequestException(`User không tồn tại: "${userEmail}"`);
      }

      const vendorID = vendorMap.get(vendorName);
      if (!vendorID) {
        throw new BadRequestException(`Vendor không tồn tại: "${vendorName}"`);
      }

      const roleID = roleMap.get(roleName);
      if (!roleID) {
        throw new BadRequestException(`Role không tồn tại: "${roleName}"`);
      }

      return { userID, vendorID, roleID };
    });

    return this.prismaService.$transaction(async (tx) => {
      await tx.userVendorRole.deleteMany({ where: { OR: idsMapping } });

      return tx.userVendorRole.createMany({
        data: idsMapping.map((item) => ({
          ...item,
          createdBy: user.userID,
        })),
      });
    });
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
