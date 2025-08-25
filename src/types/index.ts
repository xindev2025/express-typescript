import { SignUpSchema } from '@/validators/user.validator';
import z from 'zod';

export type SignUp = z.infer<typeof SignUpSchema>;
