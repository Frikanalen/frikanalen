import winston from "winston";
export const getLogger = () => {
  if (process.env["NODE_ENV"] === "production") {
    return winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  } else {
    return winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [new winston.transports.Console()],
    });
  }
};
