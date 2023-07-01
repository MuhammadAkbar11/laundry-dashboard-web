import { z } from 'zod';

export const createLaundryServiceSchema = z.object({
  name: z.string().nonempty({ message: 'Nama layanan harus diisi' }),
  description: z.string().optional(),
  unit: z.string().nonempty({ message: 'Satuan harus dipilih' }),
  price: z.number().min(0, { message: 'Harga harus lebih dari 0' }),
});

export type CreateLaundryServiceInputTypes = z.TypeOf<
  typeof createLaundryServiceSchema
>;
