import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/refresh-token', AuthController.refreshTokenSignIn);

export default router;
