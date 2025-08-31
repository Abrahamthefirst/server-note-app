"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequests = void 0;
const winston_1 = __importDefault(require("winston"));
const appLogger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.File({ filename: "app.log" })],
});
const requestLogger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.File({ filename: "http.log" })],
});
const logRequests = (req, res, next) => {
    const { method, url, body, path } = req;
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
exports.logRequests = logRequests;
