import { z } from 'zod';
import { createCustomerSchema } from './customerSchema';

export const createLaundryQueueSchema = z.object({
  deliveryType: z.string().min(1, 'Pilih Tipe pengirim').optional(),
  customerId: z
    .string({ required_error: 'Pilih pelanggan' })
    .min(1, 'Pilih pelanggan'),
  note: z.string({ required_error: 'No' }).optional(),
});

export const createLaundryQueueWithCustomerSchema = createCustomerSchema.merge(
  createLaundryQueueSchema.omit({ customerId: true })
);

export type CreateLaundryQueueInputTypes = z.TypeOf<
  typeof createLaundryQueueSchema
>;
export type CreateLaundryQueueWithCustomerInputTypes = z.TypeOf<
  typeof createLaundryQueueWithCustomerSchema
>;
