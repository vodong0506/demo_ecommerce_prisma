import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { OrdersService } from '../orders/orders.service';
import { PromotionsService } from '../promotions/promotions.service';
import { ExportOrderPromotionsDto } from './dto/get-order-promotion.dto';
import { OrderPromotion } from './entities/order-promotion.entity';

@Injectable()
export class OrderPromotionsService extends PrismaBaseService<'orderPromotion'> {
  private orderPromotionEntityName = OrderPromotion.name;
  private excelSheets = {
    [this.orderPromotionEntityName]: this.orderPromotionEntityName,
  };
  constructor(
    public prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private ordersService: OrdersService,
    private promotionsService: PromotionsService,
  ) {
    super(prismaService, 'orderPromotion');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async exportOrderPromotions(params: ExportOrderPromotionsDto) {
    const { orderIDs, promotionIDs } = params ?? {};
    const where: Prisma.OrderPromotionWhereInput = {};
    if (orderIDs) {
      where.orderID = { in: orderIDs };
    }

    if (promotionIDs) {
      where.promotionID = { in: promotionIDs };
    }

    const orderPromotions = await this.extended.export({
      select: {
        promotion: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.orderPromotionEntityName],
          fieldsMapping: {
            orderID: 'orderName',
            promotionID: 'promotionName',
          },
          fieldsExtend: ['promotionKey'],
          fieldsExclude: ['createdAt', 'createdBy'],
          data: orderPromotions.map(({ order, promotion }) => ({
            orderName: order.name,
            promotionName: promotion.name,
            promotionKey: promotion.key,
          })),
        },
      ],
    });
    return data;
  }

  async getOrderPromotions() {
    const data = await this.extended.findMany({
      select: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });
    return data;
  }
}
