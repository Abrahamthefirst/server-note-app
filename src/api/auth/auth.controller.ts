import { Request, Response, NextFunction } from "express";
import AuthService from "../../modules/auth/auth.service";
import {
  BasicLoginRequestDTO,
  BasicRegistrationRequestDTO,
} from "./dtos/request.dto";
class AuthController {
  constructor(private authService: AuthService) {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = BasicRegistrationRequestDTO.validate(req.body);

      const user = await this.authService.registerUser(dto);
      const { refresh_token, hashed_password, ...userDetails } = user;
      res.cookie("jwt", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json(userDetails);

      return;
    } catch (err) {
      next(err);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = BasicLoginRequestDTO.validate(req.body);

      const response = await this.authService.loginUser(dto);

      const { refresh_token, ...userDetails } = response;

      res
        .status(200)
        .cookie("jwt", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(userDetails);

      return;
    } catch (err) {
      next(err);
    }
  };

  emailVerificationLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.authService.getEmailVerificationLink(
        req.body.email
      );
      if (response)
        res.json({ message: "Check your email for a verification link" });
      return;
    } catch (err) {
      next(err);
    }
  };

  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.query.token as string;

      const response = await this.authService.verifyEmail(token);

      // Come back to put a frontend url
      if (response) res.redirect("");

      res.redirect("");
      return;
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.authService.forgetPassword(req.body.email);

      if (!response) {
        res.status(400).json({ message: "Email not found" });
        return;
      }

      res.status(200).json({ message: "Check mail to reset your password" });
      return;
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.authService.resetPassword(req.body);

      if (!response) {
        res
          .status(400)
          .json({ message: "Old Password cannot be the same as new Password" });
        return;
      }

      res
        .status(200)
        .json({ message: "Password has been updated successfully" });
    } catch (err) {
      next(err);
    }
  };
  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.authService.getAccessToken(
        req.cookies.refreshToken
      );
      if (response) res.status(200).json({ response });
    } catch (err) {
      const error = err as Error;
      if (error.name === "Token Expired Error") {
        res.status(200).json({ message: "You need to login" });
      }
      next(err);
    }
  };
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.user?.id as string;
      const response = await this.authService.logoutUser(id);
      if (response) res.status(200).json({ message: "Logout Successful" });
    } catch (err) {
      next(err);
    }
  };

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } =
        await this.authService.loginWithGoogle(req.user!);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.redirect(`http://localhost:3001/login?token=${accessToken}`);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ message: error.message });
      next(err);
    }
  };
}

export default AuthController;
