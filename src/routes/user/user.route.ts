import { Router } from 'express';
import { UserController } from './user.controller';
import { authorize } from '@/middlewares/authorize';

const router = Router();

router
  .route('/:id')
  .get(authorize(['user']), UserController.getUser)
  .put(authorize(['user']), UserController.updateUser);

export default router;
