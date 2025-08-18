import UserRepo from "../../repositories/user.respository";
import {
  BasicRegistrationRequestDTO,
  BasicLoginRequestDTO,
} from "../../api/auth/dtos/request.dto";
import bcrypt from "bcryptjs";
import { emailQueue } from "../../config/queue";
import { resetPasswordType } from "../../types/utilTypes";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "../../generated/prisma";
import {
  generateJWT,
  generateRefreshJwt,
  verifyAccessJwt,
  verifyRefreshJwt,
} from "../../utils/token";
import { GoneError, BadRequestError, NotFoundError } from "../../utils/error";

class AuthService {
  constructor(private userRepository: UserRepo) {}

  async registerUser(
    data: BasicRegistrationRequestDTO
  ): Promise<User & { access_token: string; refresh_token: string }> {
    try {
      const hashed_password = bcrypt.hashSync(data.password);

      const { password, ...userDetails } = data;
      const user = await this.userRepository.createUser({
        ...userDetails,
        hashed_password,
      
      });
      const refresh_token = generateRefreshJwt({ user });
      const access_token = generateJWT({ id: user.id });
      const verificationToken = generateJWT({ email: user.email });
      await emailQueue.add("send", {
        subject: "Email Verification",
        to: user.email,
        username: user.username,
        link: `http://localhost:3000/auth/email/verification/verify_by_link?token=${verificationToken}`,
        expiration: "1hr",
      });

      await this.userRepository.updateUserById({
        id: user.id,
        refresh_token,
      });

      return { ...user, access_token, refresh_token };
    } catch (err) {
      throw err;
    }
  }

  async getEmailVerificationLink(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) throw new NotFoundError("Email not found");

      const verificationToken = generateJWT({ email: user.email });

      await emailQueue.add("send", {
        subject: "Email Verification",
        to: user.email,
        username: user.username,
        link: `http://localhost:3000/auth/email/verification/verify_by_link?token=${verificationToken}`,
        expiration: "1hr",
      });

      return true;
    } catch (err) {
      throw err;
    }
  }
  async loginUser(
    data: BasicLoginRequestDTO
  ): Promise<
    Omit<
      User & { access_token: string; refresh_token: string },
      "hashed_password"
    >
  > {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      const hashedPassword = user?.hashed_password as string;

      if (!user) throw new NotFoundError("User Not Found");

      const isPasswordCorrect = bcrypt.compareSync(
        data.password,
        hashedPassword
      );

      if (!isPasswordCorrect) throw new BadRequestError("Password incorrect");

      const access_token = generateJWT({ id: user.id });
      const refresh_token = generateRefreshJwt({ email: user.email });

      await this.userRepository.updateUserById({
        id: user.id,
        refresh_token,
      });
      const { hashed_password, ...userData } = user;

      return { ...userData, access_token, refresh_token };
    } catch (err) {
      throw err;
    }
  }

  async loginWithGoogle(profile: { [key: string]: any }) {
    const email = profile.email as string;
    const username = profile.displayName as string;
    let user = await this.userRepository.getUserByEmail(email);
    let accessToken;
    let refreshToken;

    if (user) {
      accessToken = generateJWT({ id: user.id });
      refreshToken = generateRefreshJwt({ email });
      console.log(profile._json.picture, "This is picture");
      console.log(user);
    }

    const newUser = await this.userRepository.createUser({
      email,
      username,
      refresh_token: refreshToken,
      role: "VIEWER",
      picture: profile.picture,
    });

    accessToken = generateJWT({ id: newUser.id });
    refreshToken = generateRefreshJwt(newUser);

    return { accessToken, refreshToken, ...user };
  }
  async verifyEmail(token: string): Promise<boolean> {
    try {
      const decoded = verifyAccessJwt(token) as { email: string };
      const user = await this.userRepository.getUserByEmail(decoded.email);
      if (user) {
        this.userRepository.updateUserByEmail({
          ...user,
          email_verified: true,
        });
        return true;
      }
      return false;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new GoneError(
          "Verification link has expired, request for a new one"
        );
      }
      throw err;
    }
  }

  async forgetPassword(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) return false;

      const verificationToken = generateJWT({ email: user.email });
      await emailQueue.add("send", {
        subject: "Password Verification",
        to: user.email,
        username: user.username,
        link: `http://localhost:3000/auth/password/reset?token=${verificationToken}`,
        expiration: "1hr",
      });

      return true;
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(data: resetPasswordType): Promise<boolean> {
    try {
      const { oldPassword, newPassword, email } = data;
      let user = (await this.userRepository.getUserByEmail(email)) as User;
      const hashed_password = user.hashed_password as string;
      const passwordVersionCheck = bcrypt.compareSync(
        newPassword,
        hashed_password
      );

      if (passwordVersionCheck) return false;

      const newHashedPassword = bcrypt.hashSync(newPassword);
      user = { ...user, hashed_password: newHashedPassword };

      await this.userRepository.updateUserByEmail(user);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async getAccessToken(token: string): Promise<string> {
    try {
      const refreshtToken = verifyRefreshJwt(token) as {
        [key: string]: string;
      };

      const user = await this.userRepository.getUserByEmail(
        refreshtToken.email
      );

      if (!user) throw new BadRequestError("User needs to login");
      return generateJWT({ id: user.id });
    } catch (err) {
      throw err;
    }
  }

  async logoutUser(id: string): Promise<boolean> {
    try {
      const user = await this.userRepository.getUserById(Number(id));

      if (!user) return false;

      const { refresh_token, ...userDetails } = user;

      await this.userRepository.updateUserById(userDetails);

      return true;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthService;
