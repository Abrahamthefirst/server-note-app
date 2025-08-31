"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const error_1 = require("../utils/error");
class UserRepo {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.prisma.user.create({
                    data,
                });
                return userData;
            }
            catch (err) {
                if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                    if (err.code === "P2002") {
                        throw new error_1.ConflictError("Email already exits, try logging in");
                    }
                }
                throw err;
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                return userData;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getUserByGoogleId(google_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.prisma.user.findUnique({
                    where: {
                        google_id,
                    },
                });
                return userData;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id,
                    },
                });
                return user;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateUserById(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = user, data = __rest(user, ["id"]);
                const userData = yield this.prisma.user.update({
                    where: {
                        id,
                    },
                    data,
                });
                return userData;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    updateUserByEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // handle if email not found
                const { email } = user, data = __rest(user, ["email"]);
                const userData = yield this.prisma.user.update({
                    where: {
                        email,
                    },
                    data,
                });
                return userData;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.prisma.user.delete({
                    where: {
                        id,
                    },
                });
                return user;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
}
exports.default = UserRepo;
function getFirstElement(array) {
    return array[0];
}
const myResponse = {
    data: {
        status: 200,
    },
    isError: true,
};
const name = {
    data: {
        status: 300,
    },
    error: new Error("indome"),
    message: "Fast",
};
