import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDirectory = path.join("/tmp", "logs");

export const logger = winston.createLogger({
  level: "info",
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: path.join(logDirectory, "ERR-%DATE%.log"),
      zippedArchive: true,
      maxSize: "500m",
      maxFiles: "15d",
    }),
  ],
});
