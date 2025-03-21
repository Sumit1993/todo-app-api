import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(3000);
  console.log('NestJS app listening on port 3000');
}
bootstrap();
