import fs from 'fs';
import path from 'path';
import winston, { Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;

function getFormattedDateTime(): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  return formatter.format(new Date());
}

function ensureLogsDirectory(logsDir: string): void {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (error) {
    console.error(`Failed to create logs directory: ${logsDir}`, error);
    throw error;
  }
}

function createLoggerInstance(): Logger {
  const currentDate = getFormattedDateTime().split(',')[0];
  const logsDir = path.join(__dirname, '../../../logs', currentDate);
  ensureLogsDirectory(logsDir);
  const logFormat = format.combine(
    format.timestamp({ format: () => getFormattedDateTime() }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  );
  return createLogger({
    level: 'info',
    format: logFormat,
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        filename: path.join(logsDir, 'app-%DATE%.log'),
        datePattern: 'DD-MM-YYYY',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        createSymlink: false,
      }),
    ],
  });
}

const loggers = createLoggerInstance();
export default loggers;
