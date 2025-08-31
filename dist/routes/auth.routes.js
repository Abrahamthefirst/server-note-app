"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
function createAuthRouter(authController) {
    const router = express_1.default.Router();
    router.post("/signup", authController.signup);
    router.post("/login", authController.login);
    router.post("/login/refresh-token", authController.refreshToken);
    router.get("/email/verify-email", authController.verifyEmail);
    router.get("/login/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
    router.post("/api/session/oauth/google", passport_1.default.authenticate("google", { failureRedirect: "/", session: false }), authController.googleAuth);
    router.get("/email/request_email_verification/:token", authController.emailVerificationLink);
    router.post("/forgot-password", authController.forgotPassword);
    router.post("/reset-password", authController.resetPassword);
    router.post("/logout", authController.logout);
    return router;
}
