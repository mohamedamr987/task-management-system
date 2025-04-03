import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import { join } from 'path';
// import { ConfigService } from '@nestjs/config';
// import { Logger } from '@nestjs/common';
// import { LoggerModule } from './logger/logger.module';
// import { LoggerService } from './logger/logger.service';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { AllExceptionsFilter } from './filters/all-exceptions.filter';
// import { TransformInterceptor } from './interceptors/transform.interceptor';
// import { ConfigModule } from '@nestjs/config';
// import { RateLimiterModule } from 'nestjs-rate-limiter';
// import { RateLimiterGuard } from './guards/rate-limiter.guard';
// import { ThrottlerModule } from '@nestjs/throttler';
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { MorganModule } from 'nest-morgan';
// import { MorganInterceptor } from 'nest-morgan';
// import { MorganService } from 'nest-morgan';
// import { WinstonModule } from 'nest-winston';
// import { winstonLogger } from './logger/winston.logger';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth()
    .build();
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalGuards(new RateLimiterGuard());
  // app.useGlobalGuards(new ThrottlerGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
