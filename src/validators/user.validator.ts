import z from 'zod';

export const UserFormSchema = z
  .object({
    firstName: z.string().trim().min(2, 'first name is required'),
    lastName: z.string().trim().min(2, 'last name is required'),
    dateOfBirth: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
    avatar: z.string(),
    gender: z.enum(['male', 'female']),
    paymentMethod: z.enum(['cash_on_delivery']),
  })
  .partial();
