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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ExportProductsDto,
  GetProductsPaginationDto,
} from './dto/get-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createDto: CreateProductDto, @User() user) {
    return this.productsService.createProduct({ ...createDto, user });
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: Product['id'],
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct({
      data: updateProductDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getProducts(@Query() query: GetProductsPaginationDto) {
    return this.productsService.getProducts(query);
  }

  @Get('options')
  getProductOptions(@Query() query: GetOptionsParams<Product>) {
    return this.productsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportProducts(
    @Query() exportProductsDto: ExportProductsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.productsService.exportProducts(exportProductsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importProducts(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.productsService.importProducts({ file, user });
  }

  @Get(':id')
  getProduct(@Param('id') id: Product['id']) {
    return this.productsService.getProduct({ id });
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: Product['id']) {
    return this.productsService.deleteProduct({ id });
  }
}
