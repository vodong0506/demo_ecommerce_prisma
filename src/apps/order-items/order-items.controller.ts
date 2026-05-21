import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  ExportOrderItemsDto,
  GetOrderItemsPaginationDto,
} from './dto/get-order-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { OrderItem } from '@prisma/client';
import { OrderItemsService } from './order-items.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('orderItems')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  createOrderItem(@Body() createDto: CreateOrderItemDto, @User() user) {
    return this.orderItemsService.createOrderItem({ ...createDto, user });
  }

  @Patch(':id')
  updateOrderItem(
    @Param('id') id: OrderItem['id'],
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.updateOrderItem({
      data: updateOrderItemDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getOrderItems(@Query() query: GetOrderItemsPaginationDto) {
    return this.orderItemsService.getOrderItems(query);
  }

  @Get('options')
  getOrderItemOptions(@Query() query: GetOptionsParams<OrderItem>) {
    return this.orderItemsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrderItems(
    @Query() exportOrderItemsDto: ExportOrderItemsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.orderItemsService.exportOrderItems(exportOrderItemsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importOrderItems(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.orderItemsService.importOrderItems({ file, user });
  }

  @Get(':id')
  getOrderItem(@Param('id') id: OrderItem['id']) {
    return this.orderItemsService.getOrderItem({ id });
  }

  @Delete(':id')
  deleteOrderItem(@Param('id') id: OrderItem['id']) {
    return this.orderItemsService.deleteOrderItem({ id });
  }
}
