import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigType } from '@api/config/env';

import { LoggerOptions } from './logger.types';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(private configService: ConfigService<ConfigType, true>) {
    super();
  }

  private configureLog(
    message: string,
    type: 'log' | 'error',
    options?: LoggerOptions,
  ) {
    const { sensitive, context } = options ?? {};

    if (sensitive) {
      return;
    }

    switch (type) {
      case 'log':
        super.log(message, context ?? '');
        break;
      case 'error':
        super.error(message, context ?? '');
        break;
    }
  }

  printLog(message: string, options?: LoggerOptions) {
    this.configureLog(message, 'log', options);
  }

  printError(message: string, options?: LoggerOptions) {
    this.configureLog(message, 'error', options);
  }
}
