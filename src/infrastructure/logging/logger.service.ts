import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  log(message: string, context?: string): void {
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
