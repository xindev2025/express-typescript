import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordSchema,
  RefreshTokenSignInSchema,
  SignInSchema,
  SignUpSchema,
} from '@/validators/auth.validator';

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

  async refreshTokenSignIn(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = RefreshTokenSignInSchema.parse(req.body);
    if (!refreshToken) {
      throw new Error('refresh token is required');
    }

    try {
      // get stored token in db
      const storedToken = await AuthService.getRefreshToken(refreshToken);

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new Error('invalid or expired refresh token');
      }

      const result = await AuthService.generateNewTokens(storedToken.token);

      res.status(200).json({
        message: 'Successfully get new token',
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const parseData = ChangePasswordSchema.parse(req.body);
      const localUser = req.user;

      const user = await AuthService.changePassword({ password: parseData, userId: localUser!.id });

      res.status(201).json({
        message: 'Successfully update user password',
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
