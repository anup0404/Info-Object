import { Injectable } from '@nestjs/common';
import { errorLogger, infoLogger, warnLogger } from './winston.config';

@Injectable()
export class LoggerService {
  error(message: string, meta?: any) {
    errorLogger.error(message, { meta });
  }

  warn(message: string) {
    warnLogger.warn(message);
  }

  log(message: string) {
    infoLogger.info(message);
  }
}
