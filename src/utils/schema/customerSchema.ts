import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z
    .string({ required_error: 'Nama wajib diisi' })
    .min(1, 'Nama wajib diisi')
    .max(255, { message: 'Nama tidak boleh melebihi 255 karakter' }),
  address: z
    .string({ required_error: 'Alamat wajib diisi' })
    .min(1, 'Alamat wajib diisi'),
  phone: z
    .string({ required_error: 'No Telepon wajib diisi' })
    .min(1, 'No Telepon wajib diisi')
    .trim(),
  customerLevelId: z
    .string({ required_error: 'Level wajib diisi' })
    .min(1, 'Level wajib diisi'),
  point: z
    .number({
      required_error: 'Point wajib diisi',
      invalid_type_error: 'Point harus berupa angka',
    })
    .min(0, 'Point wajib diisi'),
});

export const updateCustomerSchema = createCustomerSchema.extend({
  customerId: z
    .string({ required_error: 'ID Pelanggan wajib diisi' })
    .min(1, 'ID Pelanggan wajib diisi'),
});

export type CreateCustomerInputTypes = z.TypeOf<typeof createCustomerSchema>;
export type UpdateCustomerInputTypes = z.TypeOf<typeof updateCustomerSchema>;
