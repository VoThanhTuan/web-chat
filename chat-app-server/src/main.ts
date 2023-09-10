import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RequestMethod, ValidationPipe, Logger } from '@nestjs/common'
const PORT = process.env['SERVICE_PORT'] || 4000
Logger.log('Service PORT: ', PORT)
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api/v1', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
      {
        path: 'health',
        method: RequestMethod.GET,
      },
    ],
  })

  /* Initialize Swagger */
  const config = new DocumentBuilder()
    .setTitle('Chat Server API Documentation')
    .setDescription('All API related to Chat API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(PORT)
}
bootstrap()
