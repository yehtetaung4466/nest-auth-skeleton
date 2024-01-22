import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GeneralHttpException } from './exceptions/generalHttpException';
import { ValidationPipe } from '@nestjs/common';
import { GeneralErrorException } from './exceptions/generalErrorException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());
  app.enableCors();
  app.useGlobalFilters(
    // new GeneralErrorException(),
    new GeneralHttpException(),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
