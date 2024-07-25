
import { Injectable } from '@nestjs/common';
import { errorLogger } from './winston.config'; 

@Injectable()
export class LoggerService {
  error(controllerName: string, functionName: string, error: any) {
    errorLogger.error({controllerName,functionName,error:error.message});
  }
}
