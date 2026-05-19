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
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import {
  ExportProductVariantsDto,
  GetProductVariantsPaginationDto,
} from './dto/get-product-variant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { ProductVariant } from '@prisma/client';
import { ProductVariantsService } from './product-variants.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  createProductVariant(
    @Body() createDto: CreateProductVariantDto,
    @User() user,
  ) {
    return this.productVariantsService.createProductVariant({
      ...createDto,
      user,
    });
  }

  @Patch(':id')
  updateProductVariant(
    @Param('id') id: ProductVariant['id'],
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantsService.updateProductVariant({
      data: updateProductVariantDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getProductVariants(@Query() query: GetProductVariantsPaginationDto) {
    return this.productVariantsService.getProductVariants(query);
  }

  @Get('options')
  getProductVariantOptions(@Query() query: GetOptionsParams<ProductVariant>) {
    return this.productVariantsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportProductVariants(
    @Query() exportProductVariantsDto: ExportProductVariantsDto,
    @Res() res: Response,
  ) {
    const workbook = await this.productVariantsService.exportProductVariants(
      exportProductVariantsDto,
    );
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importProductVariants(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.productVariantsService.importProductVariants({ file, user });
  }

  @Get(':id')
  getProductVariant(@Param('id') id: ProductVariant['id']) {
    return this.productVariantsService.getProductVariant({ id });
  }

  @Delete(':id')
  deleteProductVariant(@Param('id') id: ProductVariant['id']) {
    return this.productVariantsService.deleteProductVariant({ id });
  }
}
