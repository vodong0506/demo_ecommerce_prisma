import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { FileUtilService } from '../../common/utils/file-util/file-util.service';
import { FileUtilModule } from '../../common/utils/file-util/file-util.module';

@Module({
  imports: [FileUtilModule],
  controllers: [ProductImagesController],
  providers: [ProductImagesService, ExcelUtilService, FileUtilService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
