import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';

export const UserController = {
  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const user = await UserService.getUser(id);

      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({
        message: 'Successfully get user',
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
