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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const email_1 = require("../../queues/email");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../../utils/token");
const jwt_decode_1 = require("jwt-decode");
const emailVerification_1 = __importDefault(require("../../templates/emailVerification"));
const resetPassword_1 = __importDefault(require("../../templates/resetPassword"));
const error_1 = require("../../utils/error");
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    registerUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashed_password = bcryptjs_1.default.hashSync(data.password);
                const { password } = data, userDetails = __rest(data, ["password"]);
                const user = yield this.userRepository.createUser(Object.assign(Object.assign({}, userDetails), { hashed_password }));
                const refresh_token = (0, token_1.generateRefreshJwt)({ user });
                const access_token = (0, token_1.generateJWT)({ id: user.id });
                const verificationToken = (0, token_1.generateJWT)({ email: user.email });
                const link = `http://localhost:3000/auth/email/verify-email?token=${verificationToken}`;
                const html = (0, emailVerification_1.default)(user.username, link, "60");
                yield email_1.emailQueue.add("send", {
                    subject: "Email Verification",
                    to: user.email,
                    html,
                });
                yield this.userRepository.updateUserById({
                    id: user.id,
                    refresh_token,
                });
                return Object.assign(Object.assign({}, user), { access_token, refresh_token });
            }
            catch (err) {
                throw err;
            }
        });
    }
    loginUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserByEmail(data.email);
                const hashedPassword = user === null || user === void 0 ? void 0 : user.hashed_password;
                if (!user)
                    throw new error_1.NotFoundError("User Not Found");
                const isPasswordCorrect = bcryptjs_1.default.compareSync(data.password, hashedPassword);
                if (!isPasswordCorrect)
                    throw new error_1.BadRequestError("Password incorrect");
                const access_token = (0, token_1.generateJWT)({ id: user.id });
                const refresh_token = (0, token_1.generateRefreshJwt)({ email: user.email });
                yield this.userRepository.updateUserById({
                    id: user.id,
                    refresh_token,
                });
                const { hashed_password } = user, userData = __rest(user, ["hashed_password"]);
                return Object.assign(Object.assign({}, userData), { access_token, refresh_token });
            }
            catch (err) {
                throw err;
            }
        });
    }
    getEmailVerificationLink(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = (0, jwt_decode_1.jwtDecode)(token);
                const user = yield this.userRepository.getUserByEmail(email);
                if (!user)
                    throw new error_1.NotFoundError("Email not found");
                const verificationToken = (0, token_1.generateJWT)({ email: user.email });
                yield email_1.emailQueue.add("send", {
                    subject: "Email Verification",
                    to: user.email,
                    username: user.username,
                    link: `http://localhost:3000/auth/email/verification/verify_by_link?token=${verificationToken}`,
                    expiration: "1hr",
                });
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    loginWithGoogle(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = profile.email;
            const username = profile.displayName;
            let user = yield this.userRepository.getUserByEmail(email);
            let accessToken;
            let refreshToken;
            if (user) {
                accessToken = (0, token_1.generateJWT)({ id: user.id });
                refreshToken = (0, token_1.generateRefreshJwt)({ email });
                console.log(profile._json.picture, "This is picture");
                console.log(user);
            }
            const newUser = yield this.userRepository.createUser({
                email,
                username,
                refresh_token: refreshToken,
                role: "VIEWER",
                picture: profile.picture,
            });
            accessToken = (0, token_1.generateJWT)({ id: newUser.id });
            refreshToken = (0, token_1.generateRefreshJwt)(newUser);
            return Object.assign({ accessToken, refreshToken }, user);
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = (0, token_1.verifyAccessJwt)(token);
                const user = yield this.userRepository.getUserByEmail(decoded.email);
                if (user) {
                    this.userRepository.updateUserByEmail(Object.assign(Object.assign({}, user), { email_verified: true }));
                    return true;
                }
                return false;
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    throw new error_1.GoneError(token);
                }
                throw err;
            }
        });
    }
    forgetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserByEmail(email);
                if (!user)
                    return false;
                const verificationToken = (0, token_1.generateJWT)({ email: user.email });
                const link = `http://localhost:5173/reset-password/${verificationToken}`;
                const html = (0, resetPassword_1.default)(user.username, link, "60");
                yield email_1.emailQueue.add("send", {
                    subject: "Password Verification",
                    to: user.email,
                    html
                });
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    // async resetPassword(data: AuthResetPasswordType): Promise<boolean> {
    //   try {
    //     const { oldPassword, newPassword, email } = data;
    //     let user = (await this.userRepository.getUserByEmail(email)) as User;
    //     const hashed_password = user.hashed_password as string;
    //     const passwordVersionCheck = bcrypt.compareSync(
    //       newPassword,
    //       hashed_password
    //     );
    //     if (passwordVersionCheck) return false;
    //     const newHashedPassword = bcrypt.hashSync(newPassword);
    //     user = { ...user, hashed_password: newHashedPassword };
    //     await this.userRepository.updateUserByEmail(user);
    //     return true;
    //   } catch (err) {
    //     throw err;
    //   }
    // }
    resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ password, token }) {
            try {
                const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
                let user = (yield this.userRepository.getUserByEmail(decodedToken.email));
                const newHashedPassword = bcryptjs_1.default.hashSync(password);
                user = Object.assign(Object.assign({}, user), { hashed_password: newHashedPassword });
                yield this.userRepository.updateUserByEmail(user);
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshtToken = (0, token_1.verifyRefreshJwt)(token);
                const user = yield this.userRepository.getUserByEmail(refreshtToken.email);
                if (!user)
                    throw new error_1.BadRequestError("User needs to login");
                return (0, token_1.generateJWT)({ id: user.id });
            }
            catch (err) {
                throw err;
            }
        });
    }
    logoutUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserById(Number(id));
                if (!user)
                    return false;
                const { refresh_token } = user, userDetails = __rest(user, ["refresh_token"]);
                yield this.userRepository.updateUserById(userDetails);
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = AuthService;
