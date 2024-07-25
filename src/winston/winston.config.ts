import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as util from 'util';
import { red, blue, yellow, green, magenta } from 'colorette';

// Formatting function for console logs
const consoleLogFormat = format.printf(
  ({ level, message, timestamp, meta = {} }) => {
    const customLevel = colorizeLevel(level);
    const customTimestamp = green(timestamp as string);
    const customMessage = message;
    const customMeta = util.inspect(meta, {
      showHidden: false,
      depth: null,
      colors: true,
    });
    return `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`;
  },
);

// Formatting function for file logs
const fileLogFormat = format.printf(
  ({ level, message, timestamp, meta = {} }) => {
    const logMeta: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(meta)) {
      if (value instanceof Error) {
        logMeta[key] = {
          name: value.name,
          message: value.message,
          trace: value.stack || '',
        };
      } else {
        logMeta[key] = value;
      }
    }
    const logData = {
      level: level,
      message,
      timestamp,
      meta: logMeta,
    };
    return JSON.stringify(logData, null, 4);
  },
);

// Helper function to colorize log levels for console output
const colorizeLevel = (level: string) => {
  switch (level) {
    case 'error':
      return red(level);
    case 'info':
      return blue(level);
    case 'warn':
      return yellow(level);
    default:
      return level;
  }
};

// Function to create console transports

const environment = process.env.NODE_ENV || 'development';

const consoleTransport = () => {
  if (environment === 'development') {
    return [
      new transports.Console({
        level: 'error',
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  } else {
    return [];
  }
};

// Function to create file transports

const fileTransport = () => {
  return [
    new transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'error.log'),
      level: 'error',
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
    new transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'warn.log'),
      level: 'warn',
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
    new transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'info.log'),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
  ];
};

// Create separate loggers for each level
export const errorLogger = createLogger({
  defaultMeta: { meta: {} },
  transports: [
    ...consoleTransport(),
    ...fileTransport().filter((transport) => transport.level === 'error'),
  ],
});

export const warnLogger = createLogger({
  defaultMeta: { meta: {} },
  transports: [
    ...consoleTransport(),
    ...fileTransport().filter((transport) => transport.level === 'warn'),
  ],
});

export const infoLogger = createLogger({
  defaultMeta: { meta: {} },
  transports: [
    ...consoleTransport(),
    ...fileTransport().filter((transport) => transport.level === 'info'),
  ],
});
