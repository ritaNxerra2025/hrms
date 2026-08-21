import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
const ALLOWED_LOG_CONTEXTS = ['NestApplication', 'SequelizeCoreModule', 'Bootstrap'];

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  log(message: string, context?: string): void {
     if (context && !ALLOWED_LOG_CONTEXTS.includes(context)) return;
    super.log(message, context);
  }

  warn(message: string, context?: string): void {
    super.warn(message, context);
  }

  error(message: string, stack?: string, context?: string): void {
    super.error(message, stack, context);
  }

  debug(message: string, context?: string): void {
    super.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    super.verbose(message, context);
  }
}
