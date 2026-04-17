/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/');

  // Configuración global de pipes para validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CONFIGURACIÓN DE CORS - ACEPTA TODOS LOS ORÍGENES (CORREGIDA)
  app.enableCors({
    origin: '*', // Acepta cualquier origen
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
    credentials: true, // IMPORTANTE: debe ser false cuando origin es '*'
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });


  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API SERVAL')
    .setDescription('Documentación de la API REST para SERVAL | Sistema de Gestion de Restaurantes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
    customSiteTitle: 'API REST - Documentación',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
    `,
  });

  SwaggerModule.setup('api/docs-json', app, document, {
    jsonDocumentUrl: 'api/docs-json/swagger.json',
    yamlDocumentUrl: 'api/docs-json/swagger.yaml',
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Aplicación ejecutándose en: ${await app.getUrl()}`);
  console.log(`Documentación Swagger UI: ${await app.getUrl()}/api`);
  console.log(`Swagger JSON: ${await app.getUrl()}/api/docs-json/swagger.json`);
  console.log(`Swagger YAML: ${await app.getUrl()}/api/docs-json/swagger.yaml`);
}

void bootstrap();