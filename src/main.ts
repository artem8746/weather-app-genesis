import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/httpExceptionFilter';
import { TransformErrorPipe } from './common/pipes/transform-error-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Weather App')
    .setDescription('Weather App')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('API', app, document);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = {};
        validationErrors.forEach((error) => {
          errors[error.property] = error.constraints
            ? Object.values(error.constraints)
            : [];
        });

        return new BadRequestException({
          error: {
            message: 'Invalid request',
            details: errors,
          },
          status: 400,
        });
      },
    }),
    new TransformErrorPipe(),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3100);
}

bootstrap();
