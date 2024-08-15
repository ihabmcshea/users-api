import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { AppModule } from './modules/app/app.module';
import { API_PREFIX } from './shared/constants/global.constants';
import { SwaggerConfig } from './configs/config.interface';
import { GLOBAL_CONFIG } from './configs/global.config';
import { PrismaClientExceptionFilter } from './modules/filter/prismaclientexceptionfilter/prismaClientException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],  // Log errors and warnings
  });

  // Set global prefix for all routes
  app.setGlobalPrefix(API_PREFIX);

  // Apply global exception filter
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  // Configure CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,  // Frontend URL allowed for CORS
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  // Allowed methods
      credentials: true,  // Allow credentials (cookies) to be included in CORS requests
    }),
  );

  // Parse cookies
  app.use(cookieParser());

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Strip properties that do not have decorators
    forbidNonWhitelisted: true,  // Throw an error if non-whitelisted properties are present
    transform: true,  // Automatically transform payloads to DTOs
  }));

  // Swagger setup
  const configService = app.get<ConfigService>(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  if (swaggerConfig && swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'User Registration API')
      .setDescription(swaggerConfig.description || 'The User Registration API description')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  } else {
    console.warn('Swagger is disabled or the configuration is missing.');
  }

  const PORT = process.env.BACKEND_PORT || GLOBAL_CONFIG.nest.port;
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
