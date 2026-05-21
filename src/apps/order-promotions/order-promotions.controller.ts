import { Controller, Body, UseInterceptors, Get, Res } from '@nestjs/common';
import { OrderPromotionsService } from './order-promotions.service';
import { ExportOrderPromotionsDto } from './dto/get-order-promotion.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import type { Response } from 'express';

@Controller('order-promotions')
export class OrderPromotionsController {
  constructor(
    private readonly orderPromotionsService: OrderPromotionsService,
  ) {}

  @Get()
  getOrderPromotions() {
    return this.orderPromotionsService.getOrderPromotions();
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrderPromotions(
    @Body() params: ExportOrderPromotionsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.orderPromotionsService.exportOrderPromotions(params);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }
}
