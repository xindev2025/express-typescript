import { Router } from 'express';
import { UserController } from './user.controller';
import { authorize } from '@/middlewares/authorize';

const router = Router();

router.get('/:id', authorize(['user']), UserController.getUser);

export default router;
