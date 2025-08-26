import { env } from '@/config/env';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// enable to defined user in request
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserJwtPayload;
  }
}

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer')) {
      throw new Error('Bearer not found');
    }

    const token = authHeader.slice(7);

    try {
      // decode refresh token
      const user = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;

      if (!user) {
        throw new Error('Invalid token');
      }
      if (!roles.some((x) => user.role.includes(x))) {
        throw new Error('Role of user does not have enough privilege');
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
};
