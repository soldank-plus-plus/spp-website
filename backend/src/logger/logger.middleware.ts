import { NextFunction, Request, Response } from 'express';

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      if (statusCode >= 400) {
        this.logger.error(`${method} ${originalUrl} ${statusCode}`);

        return;
      }
    });

    next();
  }
}
