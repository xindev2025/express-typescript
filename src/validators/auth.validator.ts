import z from 'zod';

export const SignUpSchema = z
  .object({
    firstName: z.string().trim().min(2, 'first name is required'),
    lastName: z.string().trim().min(2, 'last name is required'),
    email: z.email('invalid email address').trim().toLowerCase(),
    dateOfBirth: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
    password: z
      .string()
      .min(8, 'password must be at least 8 characters long')
      .max(32, 'password must be at most 32 characters long')
      .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
      .regex(/\d/, 'password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'password must contain at least  one special character'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword, dateOfBirth }, ctx) => {
    // password dont match
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'password do not match',
        path: ['confirmPassword'],
      });
    }

    // dob validation
    if (dateOfBirth) {
      const now = new Date();

      // future date check
      if (dateOfBirth > now) {
        ctx.addIssue({
          code: 'custom',
          path: ['dateOfBirth'],
          message: 'date of birth cannot be in the future',
        });
      }

      // age >18 check
      const age = now.getFullYear() - dateOfBirth.getFullYear();
      const m = now.getMonth() - dateOfBirth.getMonth();
      const is18 = age > 18 || (age === 18 && m >= 0);

      if (!is18) {
        ctx.addIssue({
          code: 'custom',
          path: ['dateOfBirth'],
          message: 'must be at least 18 years old',
        });
      }
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .transform(({ confirmPassword, ...rest }) => rest);

export const SignInSchema = z.object({
  email: z.email('invalid email address').trim().toLowerCase(),
  password: z.string().min(8, 'password must be at least 8 characters'),
});
