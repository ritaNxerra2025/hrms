import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './infrastructure/logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(new LoggerService());

  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('apiPrefix') ?? 'api/v1';
  const corsOrigins = configService.get<string[]>('corsOrigins') ?? [];

  app.setGlobalPrefix(apiPrefix);

  app.use(helmet());
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('port') ?? 3000;
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nxerra HRMS SaaS Backend API')
    .setDescription(
      'Multi-tenant HRMS backend with Sequelize, MySQL, RBAC, Roles, Departments, and User management.',
    )
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/${apiPrefix}`, 'Development')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`🚀 Server running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger UI available at: http://localhost:${port}/api/docs`);
}

void bootstrap();
