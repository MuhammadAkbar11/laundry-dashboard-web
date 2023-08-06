import { ACCEPTED_IMAGE_TYPES, MAX_AVATAR_SIZE } from '@configs/varsConfig';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty('Nama wajib diisi'),
  email: z.string().nonempty('Email wajid diisi').email('Email tidak valid'),
  role: z
    .enum(['ADMIN', 'CASHIER', 'OFFICER'], { required_error: 'Pilih role' })
    .default('OFFICER'),
});

export const updateUserSchema = createUserSchema.extend({
  avatar: z
    .any()
    .optional()
    .refine(
      (files) =>
        files?.length !== 0 ? files?.[0]?.size <= MAX_AVATAR_SIZE : true,
      `Ukuran file maksimum adalah 5MB.`
    )
    .refine(
      (files) =>
        files?.length !== 0
          ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)
          : true,
      'Hanya file berformat .jpg, .jpeg, .png yang dapat diupload.'
    ),
});

export type CreateUserInputTypes = z.TypeOf<typeof createUserSchema>;
export type UpdateUserInputTypes = z.TypeOf<typeof updateUserSchema>;
