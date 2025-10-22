import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { addSwaggerDocs } from './docs/swagger.helpers';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  addSwaggerDocs(document);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
