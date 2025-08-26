import { SignInSchema, SignUpSchema } from '@/validators/auth.validator';
import { UserFormSchema } from '@/validators/user.validator';
import z from 'zod';

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;

export type User = z.infer<typeof UserFormSchema>;
