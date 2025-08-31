"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_1 = require("./error");
const errorHandler = (err, req, res, next) => {
    let message = "Internal server error";
    let statusCode = 500;
    if (err instanceof error_1.ConflictError ||
        err instanceof error_1.NotFoundError ||
        err instanceof error_1.BadRequestError ||
        err instanceof error_1.GoneError ||
        err instanceof error_1.UnauthorizedError || err instanceof
        error_1.ForbiddenError) {
        statusCode = err.status;
        message = err.message;
    }
    res.status(statusCode).json({ message });
};
exports.errorHandler = errorHandler;
