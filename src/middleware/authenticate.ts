import { Request, Response, NextFunction } from "express";
import { verifyAccessJwt } from "../utils/token";
import { TokenExpiredError } from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/error";


type decoded = {
  [key: string]: any;
};
export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];

      console.log(token, "This might be")
      const decoded = verifyAccessJwt(token) as decoded;
      console.log(decoded, "What is the decoded")

      req.user = { id: decoded.id, ...decoded };
      next();
    } catch (err) {
      console.log(err, "What is the error")
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedError("Token expired")
      } else {
        throw new ForbiddenError("Malformed jwt")
      }
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
