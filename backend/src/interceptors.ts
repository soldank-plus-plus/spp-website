import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpExceptionBody,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

const isHttpExceptionBody = (
  res: string | object,
): res is HttpExceptionBody => {
  // Response from error can be an object (that's the literal definition in library's type).
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return typeof res === 'object' && !!res.message && res.statusCode;
};

@Injectable()
export class ErrorMessageInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpException) {
          const res = err.getResponse();

          if (isHttpExceptionBody(res)) {
            const message = res.message;

            if (Array.isArray(message)) {
              const newResBody = HttpException.createBody(
                message.join(' | '),
                res.error || '',
                res.statusCode,
              );
              const newErr = new HttpException(newResBody, res.statusCode);

              return throwError(() => newErr);
            }
          }
        }

        return throwError(() => err);
      }),
    );
  }
}
