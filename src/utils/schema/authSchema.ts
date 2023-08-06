import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().nonempty('Email wajib diisi').email('Email tidak valid'),
  password: z.string().nonempty('Password wajib diisi'),
});

export const signUpSchema = z
  .object({
    username: z.string().nonempty('Username wajib diisi'),
    email: z.string().nonempty('Email wajib diisi').email('Email tidak valid'),
    password: z
      .string()
      .nonempty('Password wajib diisi')
      .min(6, 'Password terlalu pendek'),
    passwordConfirmation: z
      .string()
      .nonempty('Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password tidak sama!',
    path: ['passwordConfirmation'],
  });

export type SignInInputTypes = z.TypeOf<typeof signInSchema>;
export type SignUpInputTypes = z.TypeOf<typeof signUpSchema>;
