import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product, ProductVariant } from '@prisma/client';
import type { Response } from 'express';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response/excel-response.interceptor';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { User } from '../../common/decorators/user.decorator';
import type { GetOptionsParams } from '../../common/query/options.interface';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { ProductVariantParams } from './consts/vendor-product-variant.const';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import {
  ExportProductVariantsDto,
  GetProductVariantsPaginationDto,
} from './dto/get-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantsService } from './product-variants.service';

@Controller(
  `vendors/:${ProductVariantParams.VENDOR_ID_PARAM}/products/:${ProductVariantParams.PRODUCT_ID_PARAM}/variants`,
)
export class VendorProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportProductVariants(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Query() exportDto: ExportProductVariantsDto,
    @Res() res: Response,
  ) {
    const workbook = await this.productVariantsService.exportProductVariants({
      ...exportDto,
      productID: productId,
    });
    await workbook.xlsx.write(res);
    res.end();
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importProductVariants(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @UploadedFile() file: File,
    @User() user: UserInfo,
  ) {
    return this.productVariantsService.importProductVariants({
      file,
      user,
      productID: productId,
    });
  }

  @Get('options')
  getProductVariantOptions(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Query() query: GetOptionsParams<ProductVariant>,
  ) {
    return this.productVariantsService.getOptions({
      ...query,
      productID: productId,
    });
  }

  @Post()
  createProductVariant(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Body() createDto: CreateProductVariantDto,
    @User() user: UserInfo,
  ) {
    return this.productVariantsService.createProductVariant({
      ...createDto,
      product: { connect: { id: productId } }, // ← lấy từ URL
      user,
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getProductVariants(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Query() query: GetProductVariantsPaginationDto,
  ) {
    return this.productVariantsService.getProductVariants({
      ...query,
      productID: productId,
    });
  }

  @Get(`:id`)
  getProductVariant(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Param('id') id: ProductVariant['id'],
  ) {
    return this.productVariantsService.getProductVariant({
      id,
      productID: productId,
    });
  }

  @Patch(`:id`)
  updateProductVariant(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Param('id') id: ProductVariant['id'],
    @Body() updateDto: UpdateProductVariantDto,
  ) {
    return this.productVariantsService.updateProductVariant({
      data: updateDto,
      where: { id, productID: productId },
    });
  }

  @Delete(`:id`)
  deleteProductVariant(
    @Param(ProductVariantParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @Param('id') id: ProductVariant['id'],
  ) {
    return this.productVariantsService.deleteProductVariant({
      id,
      productID: productId,
    });
  }
}
