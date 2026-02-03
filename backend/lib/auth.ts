import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface JwtPayload {
  userId: string;
}

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashed: string): Promise<boolean> => bcrypt.compare(password, hashed);

const generateToken = (userId: string): string => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

// Simple token verification function (for direct use)
const verifyTokenSimple = (token: string): string | jwt.JwtPayload => jwt.verify(token, JWT_SECRET);

// Middleware function to verify JWT token from cookies
const verifyToken = (req: Request, res: Response, next: NextFunction): void | Response => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.userId, email: '', name: '' };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export { hashPassword, comparePassword, generateToken, verifyToken, verifyTokenSimple };
