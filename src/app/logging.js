import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = winston.createLogger({
  level: "info",
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: "ERR-%DATE%.log",
      zippedArchive: true,
      maxSize: "500m",
      maxFiles: "15d",
    }),
  ],
});
