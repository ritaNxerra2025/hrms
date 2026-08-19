import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../infrastructure/logging/logger.service';

/**
 * Global exception filter. Converts every error into a consistent JSON
 * shape and NEVER leaks database/SQL internals to the client.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const body = exceptionResponse as { message?: string | string[] };
        message = body.message ?? exception.message;
      }
    } else {
      const error = exception as Error;
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}: ${error?.message}`,
        error?.stack,
        'AllExceptionsFilter',
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      data: null,
    });
  }
}
