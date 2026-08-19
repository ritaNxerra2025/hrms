import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  accessToken?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((responseData) => {
        if (
          responseData === null ||
          responseData === undefined
        ) {
          return {
            statusCode: 200,
            message: 'Success',
            data: null,
          };
        }

        if (
          typeof responseData === 'object' &&
          'statusCode' in responseData &&
          'message' in responseData &&
          'data' in responseData
        ) {
          return responseData;
        }

        const result: ApiResponse<T> = {
          statusCode: 200,
          message: 'Success',
          data: responseData,
        };

        if (
          typeof responseData === 'object' &&
          responseData !== null &&
          'accessToken' in responseData
        ) {
          result.accessToken = (responseData as Record<string, unknown>).accessToken as string;
        }

        return result;
      }),
    );
  }
}
