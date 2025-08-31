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
const request_dto_1 = require("./dtos/request.dto");
const error_1 = require("../../utils/error");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = request_dto_1.BasicRegistrationRequestDTO.validate(req.body);
                const user = yield this.authService.registerUser(dto);
                const { refresh_token, hashed_password } = user, userDetails = __rest(user, ["refresh_token", "hashed_password"]);
                res.cookie("jwt", refresh_token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json(userDetails);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = request_dto_1.BasicLoginRequestDTO.validate(req.body);
                const response = yield this.authService.loginUser(dto);
                const { refresh_token } = response, userDetails = __rest(response, ["refresh_token"]);
                res
                    .status(200)
                    .cookie("jwt", refresh_token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/",
                    maxAge: 24 * 60 * 60 * 1000,
                })
                    .json(userDetails);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.emailVerificationLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.params.token;
                const response = yield this.authService.getEmailVerificationLink(token);
                if (response)
                    res
                        .status(200)
                        .json({ message: "Check your email for a verification link" });
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.query.token;
                const response = yield this.authService.verifyEmail(token);
                if (response) {
                    return res.status(302).redirect("http://localhost:5173/");
                }
                res.status(302).redirect("www.google.com");
                return;
            }
            catch (err) {
                if (err instanceof error_1.GoneError) {
                    return res
                        .status(302)
                        .redirect(`http://localhost:5173/email/verification-link/${err.message}`);
                }
                console.log("lets verify if it gets here");
                next(err);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.forgetPassword(req.body.email);
                if (!response) {
                    res.status(400).json({ message: "Email not found" });
                    return;
                }
                res.status(200).json({ message: "Check mail to reset your password" });
                return;
            }
            catch (err) {
                next(err);
            }
        });
        // resetPassword = async (
        //   req: Request,
        //   res: Response,
        //   next: NextFunction
        // ): Promise<void> => {
        //   try {
        //     const response = await this.authService.resetPassword(req.body);
        //     if (!response) {
        //       res
        //         .status(400)
        //         .json({ message: "Old Password cannot be the same as new Password" });
        //       return;
        //     }
        //     res
        //       .status(200)
        //       .json({ message: "Password has been updated successfully" });
        //   } catch (err) {
        //     next(err);
        //   }
        // };
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.resetPassword(req.body);
                if (!response) {
                    res
                        .status(400)
                        .json({ message: "Old Password cannot be the same as new Password" });
                    return;
                }
                res
                    .status(200)
                    .json({ message: "Password has been updated successfully" });
            }
            catch (err) {
                next(err);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.getAccessToken(req.cookies.jwt);
                if (response)
                    res.status(200).json({ access_token: response });
            }
            catch (err) {
                const error = err;
                if (error.name === "Token Expired Error") {
                    res.status(200).json({ message: "You need to login" });
                }
                next(err);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const response = yield this.authService.logoutUser(id);
                if (response)
                    res.status(200).json({ message: "Logout Successful" });
            }
            catch (err) {
                next(err);
            }
        });
        this.googleAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshToken } = yield this.authService.loginWithGoogle(req.user);
                res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.redirect(`http://localhost:3001/login?token=${accessToken}`);
            }
            catch (err) {
                const error = err;
                res.status(400).json({ message: error.message });
                next(err);
            }
        });
    }
}
exports.default = AuthController;
