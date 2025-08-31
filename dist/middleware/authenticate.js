"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticate;
const token_1 = require("../utils/token");
const jsonwebtoken_1 = require("jsonwebtoken");
const error_1 = require("../utils/error");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = (0, token_1.verifyAccessJwt)(token);
            req.user = Object.assign({ id: decoded.id }, decoded);
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new error_1.UnauthorizedError("Token expired");
            }
            else {
                throw new error_1.ForbiddenError("Malformed jwt");
            }
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
}
