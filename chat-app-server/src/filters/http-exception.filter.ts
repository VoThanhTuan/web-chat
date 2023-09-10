import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()
    const request = http.getRequest<Request>()
    const status = exception.getStatus()
    const { message } = exception

    response.status(status).json({
      timestamp: new Date().getTime(),
      status,
      message,
      path: request.url,
    })
  }
}
