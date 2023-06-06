import { z } from 'zod';

export const createLaundryItemSchema = z.object({
  serviceId: z.string().min(1, 'Pilih jenis layanan'),
  qty: z
    .number({
      required_error: 'Quantity wajib diisi',
      invalid_type_error: 'Quantity harus berupa angka',
    })
    .min(1, 'Quantity harus lebih dari 0'),
  note: z.string().optional(),
});

export type CreateLaundryItemInputTypes = z.TypeOf<
  typeof createLaundryItemSchema
>;
