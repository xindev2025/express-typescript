import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpSchema } from '@/validators/user.validator';

export const AuthController = {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const parseData = SignUpSchema.parse(req.body);

      const user = await AuthService.signUp(parseData);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
};
