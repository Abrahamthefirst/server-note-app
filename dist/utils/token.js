"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshJwt = exports.verifyAccessJwt = exports.generateRefreshJwt = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessSecret = process.env.ACCESS_TOKEN || "";
const refreshSecret = process.env.REFRESH_TOKEN || "";
const generateJWT = function (payload) {
    return jsonwebtoken_1.default.sign(payload, accessSecret, { expiresIn: "1h" });
};
exports.generateJWT = generateJWT;
const generateRefreshJwt = function (payload) {
    return jsonwebtoken_1.default.sign(payload, refreshSecret, { expiresIn: "1d" });
};
exports.generateRefreshJwt = generateRefreshJwt;
const verifyAccessJwt = function (token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, accessSecret);
        return payload;
    }
    catch (err) {
        throw err;
    }
};
exports.verifyAccessJwt = verifyAccessJwt;
const verifyRefreshJwt = function (token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, refreshSecret);
        return payload;
    }
    catch (err) {
        throw err;
    }
};
exports.verifyRefreshJwt = verifyRefreshJwt;
