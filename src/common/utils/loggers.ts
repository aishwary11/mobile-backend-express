import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;

const getFormattedDate = (): string =>
  new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

const ensureLogsDirectory = (logsDir: string): void => {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create logs directory: ${logsDir}`, error);
    throw error;
  }
};

const getFormattedTimestamp = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return now.toLocaleString('en-IN', options).replace(',', '');
};

const createLoggerInstance = () => {
  const currentDate = getFormattedDate();
  const logsDir = path.join(__dirname, '../../../logs', currentDate);
  ensureLogsDirectory(logsDir);

  const logFormat = format.combine(
    format.timestamp({ format: getFormattedTimestamp }),
    format.printf(({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
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
      }),
    ],
  });
};

export default createLoggerInstance();
