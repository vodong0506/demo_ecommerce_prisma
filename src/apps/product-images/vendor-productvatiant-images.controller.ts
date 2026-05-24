import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductImage, ProductVariant } from '@prisma/client';
import type { UserInfo } from 'src/common/decorators/user.decorator';
import { User } from '../../common/decorators/user.decorator';
import { VendorProductImageParams } from './const/vendor-product-image.const';
import { UpdateProductImageDto } from './dto/update-product-images.dto';
import { ProductImagesService } from './product-images.service';

// ── Variant Images ───────────────────────────────────────────────
@Controller(
  `vendors/:${VendorProductImageParams.VENDOR_ID_PARAM}/products/:${VendorProductImageParams.PRODUCT_ID_PARAM}/variants/:${VendorProductImageParams.VARIANT_ID_PARAM}/images`,
)
export class VendorProductVariantImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  // vendor-productvariant-images.controller.ts
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadVariantImages(
    @Param(VendorProductImageParams.VARIANT_ID_PARAM)
    variantId: ProductVariant['id'],
    @UploadedFiles() files: Express.Multer.File[], // ← đổi type
    @User() user: UserInfo,
  ) {
    return this.productImagesService.uploadProductImages({
      files,
      user,
      productVariantID: variantId,
    });
  }

  @Get()
  getVariantImages(
    @Param(VendorProductImageParams.VARIANT_ID_PARAM)
    variantId: ProductVariant['id'],
  ) {
    return this.productImagesService.getProductImagesByProduct({
      productVariantID: variantId,
    });
  }

  @Patch(`:id`)
  updateVariantImage(
    @Param('id') id: ProductImage['id'],
    @Body() updateDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.updateProductImage({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(`:id`)
  deleteVariantImage(@Param('id') id: ProductImage['id']) {
    return this.productImagesService.deleteProductImage({ id });
  }
}
