import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class GeneralUEException implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
    response.status(exception.status || status).json({
      response: exception,
    });
  }
}
