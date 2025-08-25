import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInSchema, SignUpSchema } from '@/validators/auth.validator';

export const AuthController = {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const parseData = SignUpSchema.parse(req.body);

      const user = await AuthService.signUp(parseData);

      res.status(201).json({
        message: 'Successfully get sign up user',
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const parseData = SignInSchema.parse(req.body);

      const result = await AuthService.signIn(parseData);

      res.status(200).json({
        message: 'Successfully get sign in user',
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
