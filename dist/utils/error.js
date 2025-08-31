"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoneError = exports.BadRequestError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ConflictError = void 0;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
        this.status = 409;
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
        this.status = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
        this.status = 400;
    }
}
exports.BadRequestError = BadRequestError;
class GoneError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
        this.status = 410;
    }
}
exports.GoneError = GoneError;
