import { ACCEPTED_IMAGE_TYPES } from '@configs/varsConfig';
import { z } from 'zod';

export const memberOrderSchema = z
  .object({
    deliveryType: z.string().nonempty('Pili Jenis Penjemputan / Pengiriman.'),
    deliveryAddress: z.string().optional(),
    note: z.string().optional(),
    pickupAt: z.object({
      date: z.string().nonempty({ message: 'Kolom tanggal wajib diisi.' }),
      time: z
        .string()
        .nonempty({ message: 'Kolom jam wajib diisi.' })
        .refine(
          (value) => {
            const [hours] = value.split(':').map(Number);
            return hours >= 7 && hours <= 17;
          },
          {
            message:
              'waktu tidak sesuai jam kerja kami yaitu 07:00 AM sd 17:00 PM',
          }
        ),
    }),
    services: z
      .array(z.string())
      .nonempty({ message: 'Minimal satu layanan harus di pilih.' }),
  })
  .refine(
    (data) => {
      return data.deliveryType === 'DELIVERED'
        ? data.deliveryAddress !== ''
        : true;
    },
    {
      message: 'Alamat wajib diisi.',
      path: ['deliveryAddress'],
    }
  );

export const memberPaymentSchema = z
  .object({
    paymentMethod: z
      .string({ required_error: 'Pilih metode pembayaran' })
      .nonempty('Pilih metode pembayaran'),
    proof: z.any().optional(),
    // .refine(
    //   (files) =>
    //     files?.length !== 0 ? files?.[0]?.size <= MAX_AVATAR_SIZE : true,
    //   `Ukuran file maksimum adalah 5MB.`
    // )
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'BANK_TRANSFER') {
        return data?.proof?.length !== 0
          ? ACCEPTED_IMAGE_TYPES.includes(data?.proof?.[0]?.type)
          : false;
      }
      return true;
    },
    {
      message: 'Hanya file berformat .jpg, .jpeg, .png yang dapat diupload.',
      path: ['proof'],
    }
  );

export type MemberOrderInputTypes = z.TypeOf<typeof memberOrderSchema>;
export type MemberPaymentInputTypes = z.TypeOf<typeof memberPaymentSchema>;
