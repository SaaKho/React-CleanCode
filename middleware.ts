import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";//It checks for the secret key in Env variable or uses the default value

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction//To pass control to the next function
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");//retrieve JWT from Auth header and remove Bearer
  //?if it req.header is null code doesnt throw error

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
