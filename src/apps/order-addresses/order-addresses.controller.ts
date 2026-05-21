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
import { CreateOrderAddressDto } from './dto/create-order-address.dto';
import { UpdateOrderAddressDto } from './dto/update-order-address.dto';
import {
  ExportOrderAddressesDto,
  GetOrderAddressesPaginationDto,
} from './dto/get-order-address.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { OrderAddress } from '@prisma/client';
import { OrderAddressesService } from './order-addresses.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('orderAddresses')
export class OrderAddressesController {
  constructor(private readonly orderAddressesService: OrderAddressesService) {}

  @Post()
  createOrderAddress(@Body() createDto: CreateOrderAddressDto, @User() user) {
    return this.orderAddressesService.createOrderAddress({
      ...createDto,
      user,
    });
  }

  @Patch(':id')
  updateOrderAddress(
    @Param('id') id: OrderAddress['id'],
    @Body() updateOrderAddressDto: UpdateOrderAddressDto,
  ) {
    return this.orderAddressesService.updateOrderAddress({
      data: updateOrderAddressDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getOrderAddresses(@Query() query: GetOrderAddressesPaginationDto) {
    return this.orderAddressesService.getOrderAddresses(query);
  }

  @Get('options')
  getOrderAddressOptions(@Query() query: GetOptionsParams<OrderAddress>) {
    return this.orderAddressesService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrderAddresses(
    @Query() exportOrderAddressesDto: ExportOrderAddressesDto,
    @Res() res: Response,
  ) {
    const workbook = await this.orderAddressesService.exportOrderAddresses(
      exportOrderAddressesDto,
    );
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importOrderAddresses(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.orderAddressesService.importOrderAddresses({ file, user });
  }

  @Get(':id')
  getOrderAddress(@Param('id') id: OrderAddress['id']) {
    return this.orderAddressesService.getOrderAddress({ id });
  }

  @Delete(':id')
  deleteOrderAddress(@Param('id') id: OrderAddress['id']) {
    return this.orderAddressesService.deleteOrderAddress({ id });
  }
}
