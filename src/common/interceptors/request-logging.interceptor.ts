import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoggerService } from '../../infrastructure/logging/logger.service';

/**
 * Logs method, URL, status and duration for every request.
 * Deliberately does not log headers or bodies.
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startedAt = Date.now();

    return next.handle().pipe(
      finalize(() => {
        const response = context.switchToHttp().getResponse();
        this.logger.log(
          `${method} ${url} ${response.statusCode} ${Date.now() - startedAt}ms`,
          'HTTP',
        );
      }),
    );
  }
}
