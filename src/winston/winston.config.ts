import { createLogger, format, transports } from 'winston';
import * as path from 'path';


// formating of file

const fileLogFormat = format.printf(({ level, timestamp,message }) => {
  const { context, ...restMeta } = message || {};

  let logMessage = '';


  if (restMeta.error) {
    logMessage += `\nError: ${restMeta.error}`; 
  }

  const logData = {
    level,
    timestamp,
    meta: {
      context,
      ...restMeta,
    },
  };

  return JSON.stringify(logData, null, 2);
});



// Function to create file transports

const fileTransport = (level: string) => {
  return new transports.File({
    filename: path.join(__dirname, '..', '..', 'logs', `${level}.log`),
    level,
    format: format.combine(
      format.timestamp(),
      fileLogFormat
    ),
  });
};


// Create loggers for each level
export const errorLogger = createLogger({
  transports: [
    fileTransport('error'), 
  ],
});






// export const warnLogger = createLogger({
//   transports: [
//     fileTransport('warn')
//   ],
// });

// export const infoLogger = createLogger({
//   transports: [
//     fileTransport('info')
//   ],
// });

