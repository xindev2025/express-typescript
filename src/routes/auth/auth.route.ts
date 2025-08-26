import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authorize } from '@/middlewares/authorize';

const router = Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/refresh-token', AuthController.refreshTokenSignIn);
router.post('/change-password', authorize(['user']), AuthController.changePassword);

export default router;
