// main.ts
/* Created By: Rahul 30-11-2023 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* Created By: Rahul 30-11-2023 */
  const config = new DocumentBuilder()
    .setTitle('EcommDaddy.com')
    .setDescription('API Description')
    .setVersion('1.0')
    .addTag('List')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

app.enableCors();
  await app.listen(4000);
}
bootstrap();
