import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './core/exceptions/exceptions-filter';
import { CustomHttpException, DomainExceptionCode } from './core/exceptions/domain.exception';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        const details = errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        }));
        throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST,'Validation failed', details);
      },
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors();

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
