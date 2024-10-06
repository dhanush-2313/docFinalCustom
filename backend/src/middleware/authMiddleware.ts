import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const tokenn = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, tokenn) as JwtPayload;
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res
        .status(403)
        .json({ msg: "authentication error login/signup first" });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ msg: "authentication error login/signup first" });
  }
};

export default authMiddleware;
