import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggingInterceptor } from 'src/logger/logging.interceptor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from 'src/catch-everything/catch-everything.filter';
import { ApiUtilModule } from 'src/common/utils/api-util/api-util.module';
import { ZodExceptionFilter } from 'src/catch-everything/zod-exception/zod-exception.filter';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AccessControlGuard } from 'src/common/guards/access-control/access-control.guard';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response/format-response.interceptor';
import { DateUtilModule } from 'src/common/utils/date-util/date-util.module';
import { ExcelUtilModule } from 'src/common/utils/excel-util/excel-util.module';
import { PaginationUtilModule } from 'src/common/utils/pagination-util/pagination-util.module';
import { QueryUtilModule } from 'src/common/utils/query-util/query-util.module';
import { StringUtilModule } from 'src/common/utils/string-util/string-util.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolesModule } from './roles/roles.module';
import { UserVendorRolesModule } from './user-vendor-roles/user-vendor-roles.module';
import { VendorsModule } from './vendors/vendors.module';
import { AuthGuard } from './auth/auth.guard';
import { FileUtilModule } from 'src/common/utils/file-util/file-util.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheUtilModule } from 'src/common/utils/cache-util/cache-util.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { ProductsModule } from './products/products.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserSystemRolesModule } from './user-system-role/user-system-roles.module';
import { EventsModule } from 'src/events/events.module';
import { MailUtilModule } from 'src/common/utils/mail-util/mail-util.module';
import { RateLimitModule } from 'src/common/security/rate-limit/rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // validate: validate,
    }),
    LoggerModule,
    ApiUtilModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    StringUtilModule,
    AuthModule,
    DateUtilModule,
    ApiUtilModule,
    ExcelUtilModule,
    PaginationUtilModule,
    PermissionsModule,
    RolesModule,
    RolePermissionsModule,
    UserSystemRolesModule,
    UserVendorRolesModule,
    VendorsModule,
    QueryUtilModule,
    PaginationUtilModule,
    PermissionsModule,
    RolesModule,
    RolePermissionsModule,
    FileUtilModule,
    CacheUtilModule,
    CategoriesModule,
    ProductCategoriesModule,
    ProductImagesModule,
    ProductVariantsModule,
    ProductsModule,
    EventEmitterModule.forRoot(),
    EventsModule,
    MailUtilModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    ZodExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessControlGuard,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
  ],
})
export class AppModule {}

// APP_GUARD → bảo vệ route (authorization/authentication).
// APP_INTERCEPTOR → can thiệp vào request/response (logging, transform).
// APP_PIPE → validate/transform dữ liệu đầu vào.
// APP_FILTER → xử lý exception toàn cục.
