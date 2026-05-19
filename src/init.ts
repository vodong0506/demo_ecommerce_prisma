import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { applyMiddleware } from './common/middleware/common.middleware';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';

const initOpenAPI = (app: INestApplication) => {
  const { APP_NAME } = process.env;
  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(`${APP_NAME} API`)
      .setDescription(`${APP_NAME} API description`)
      .setVersion('1.0.0')
      .build(),
  );

  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc));
};

const initApp = (app: INestApplication) => {
  const { APP_PREFIX = '/api', FE_URL } = process.env;
  app.setGlobalPrefix(APP_PREFIX);
  if (FE_URL) {
    app.enableCors({
      origin: FE_URL,
    });
  }
  applyMiddleware(app);
  initOpenAPI(app);
  // (Global validation: validate DTO, remove unknown fields, auto transform types)
  app.useGlobalPipes(
    // new ValidationPipe({
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    //   transform: true,
    // }),
    new ZodValidationPipe(),
  );
  app.enableShutdownHooks();

  return app;
};
export { initApp };

// APP_PREFIX dùng để thêm prefix cho toàn bộ API.
// FE_URL dùng để cấu hình CORS, cho phép frontend truy cập backend một cách an toàn.

// Logging system dùng Interceptor và Winston để ghi lại request/response của API.
// Log bao gồm: method, URL, userId, requestId và thời gian xử lý.
// Mục đích: giúp debug lỗi nhanh, theo dõi hoạt động và đánh giá hiệu suất hệ thống.
