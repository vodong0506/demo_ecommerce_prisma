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
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
  ExportPromotionsDto,
  GetPromotionsPaginationDto,
} from './dto/get-promotion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { Promotion } from '@prisma/client';
import { PromotionsService } from './promotions.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  createPromotion(@Body() createDto: CreatePromotionDto, @User() user) {
    return this.promotionsService.createPromotion({ ...createDto, user });
  }

  @Patch(':id')
  updatePromotion(
    @Param('id') id: Promotion['id'],
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.updatePromotion({
      data: updatePromotionDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getPromotions(@Query() query: GetPromotionsPaginationDto) {
    return this.promotionsService.getPromotions(query);
  }

  @Get('options')
  getPromotionOptions(@Query() query: GetOptionsParams<Promotion>) {
    return this.promotionsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportPromotions(
    @Query() exportPromotionsDto: ExportPromotionsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.promotionsService.exportPromotions(exportPromotionsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importPromotions(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.promotionsService.importPromotions({ file, user });
  }

  @Get(':id')
  getPromotion(@Param('id') id: Promotion['id']) {
    return this.promotionsService.getPromotion({ id });
  }

  @Delete(':id')
  deletePromotion(@Param('id') id: Promotion['id']) {
    return this.promotionsService.deletePromotion({ id });
  }
}
