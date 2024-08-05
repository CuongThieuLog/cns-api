import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('nsbe example')
    .setDescription('The nsbe API description')
    .setVersion('1.0')
    .addTag('nsbe')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(cookieParser())
  app.enableCors()

  await app.listen(5000)
}

bootstrap()
