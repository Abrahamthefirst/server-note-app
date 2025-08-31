import winston from "winston";
import { Request, Response, NextFunction } from "express";

const appLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "app.log" })],
});

const requestLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "http.log" })],
});

export const logRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url,  body, path } = req;
 const { authorization } = req.headers;
  requestLogger.info("Incoming Request", {
    method,
    url,
    headers: { authorization },
    body,
    path,
    timestamp: new Date().toISOString(),
  });

  const originalSend = res.send;
  res.send = function (body) {
    requestLogger.info("Outgoing Response", {
      method,
      url,
      statusCode: res.statusCode,
      responseBody: body,
      timestamp: new Date().toISOString(),
    });
    return originalSend.call(this, body);
  };

  next();
};
