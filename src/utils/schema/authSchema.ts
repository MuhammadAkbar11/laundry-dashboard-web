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

/**
 * Issue 015-B — Forgot password request.
 *
 * Single email field. The backend always returns a generic
 * "if-an-account-exists" message to avoid account-enumeration leaks
 * (see issue 015-B §7 "Forgot Password Response"), so the form does
 * not branch on the response body.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().nonempty('Email wajib diisi').email('Email tidak valid'),
});

/**
 * Issue 015-B — Reset password request.
 *
 * `token` is read from the URL query string by the page and passed in.
 * `newPassword` and `confirmPassword` must match.
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().nonempty('Token reset tidak valid'),
    newPassword: z
      .string()
      .nonempty('Password baru wajib diisi')
      .min(6, 'Password terlalu pendek (minimal 6 karakter)'),
    confirmPassword: z.string().nonempty('Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password tidak sama!',
    path: ['confirmPassword'],
  });

export type SignInInputTypes = z.TypeOf<typeof signInSchema>;
export type SignUpInputTypes = z.TypeOf<typeof signUpSchema>;
export type ForgotPasswordInputTypes = z.TypeOf<typeof forgotPasswordSchema>;
export type ResetPasswordInputTypes = z.TypeOf<typeof resetPasswordSchema>;
