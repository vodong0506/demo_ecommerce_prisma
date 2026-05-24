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
import { ProductImage, Vendor } from '@prisma/client';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { User } from '../../common/decorators/user.decorator';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { Product } from '../products/entities/product.entity';
import { VendorProductImageParams } from './const/vendor-product-image.const';
import { UpdateProductImageDto } from './dto/update-product-images.dto';
import { ProductImagesService } from './product-images.service';

// ── Product Images ───────────────────────────────────────────────
@Controller(
  `vendors/:${VendorProductImageParams.VENDOR_ID_PARAM}/products/:${VendorProductImageParams.PRODUCT_ID_PARAM}/images`,
)
export class VendorProductImageController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadProductImages(
    @Param(VendorProductImageParams.PRODUCT_ID_PARAM) productId: Product['id'],
    @UploadedFiles() files: File[],
    @User() user: UserInfo,
  ) {
    return this.productImagesService.uploadProductImages({
      files,
      user,
      productID: productId, // ← gán productID từ URL
    });
  }

  @Get()
  getProductImages(
    @Param(VendorProductImageParams.PRODUCT_ID_PARAM) productId: Product['id'],
  ) {
    return this.productImagesService.getProductImagesByProduct({
      productID: productId,
    });
  }

  @Patch(`:id`)
  updateProductImage(
    @Param(VendorProductImageParams.VENDOR_ID_PARAM) vendorId: Vendor['id'], // ← thêm
    @Param('id') id: ProductImage['id'],
    @Body() updateDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.updateProductImage({
      where: { id, vendorID: vendorId }, // ← truyền vendorID
      data: updateDto,
    });
  }

  @Delete(`:id`)
  deleteProductImage(
    @Param(VendorProductImageParams.VENDOR_ID_PARAM) vendorId: Vendor['id'], // ← thêm
    @Param('id') id: ProductImage['id'],
  ) {
    return this.productImagesService.deleteProductImage({
      id,
      vendorID: vendorId, // ← truyền vendorID
    });
  }
}
