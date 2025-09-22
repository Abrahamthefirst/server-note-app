import express from "express";
import AuthController from "../api/auth/auth.controller";
import passport from "passport";

export function createAuthRouter(authController: AuthController) {
  const router = express.Router();

  router.post("/signup", authController.signup);

  router.post("/login", authController.login);
  router.post("/login/refresh-token", authController.refreshToken);
  router.get("/email/verify-email", authController.verifyEmail);
  router.get("/email/request_email_verification/:token", authController.emailVerificationLink);

  router.get(
    "/login/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.post(
    "/api/session/oauth/google",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    authController.googleAuth
  );

 
  router.post("/forgot-password", authController.forgotPassword);

  router.post("/reset-password", authController.resetPassword);

  router.post("/logout", authController.logout);
  return router;
}
