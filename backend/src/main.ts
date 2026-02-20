import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Importador XML API')
    .setDescription('API para importação e processamento de arquivos XML de NF-e')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor NestJS rodando na porta ${port}`);
  console.log(`📡 CORS habilitado para http://localhost:4200`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/api`);
}

bootstrap();
