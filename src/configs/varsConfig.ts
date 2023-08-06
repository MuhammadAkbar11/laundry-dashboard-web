/* eslint-disable prefer-destructuring */
import { BootstrapBreakpointsTypes } from '@utils/types';

export const APP_NAME = 'TANTE LAUNDRY JATIMAKMUR';
export const UNKNOWM_ERROR = 'UNKNOWM_ERROR';
export const API_URI = process.env.NEXT_PUBLIC_API_URI;
export const NODE_ENV = process.env.NODE_ENV;
export const MAX_AVATAR_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const BOOTSTRAP_BREAKPOINTS: Record<BootstrapBreakpointsTypes, string> =
  {
    xs: '(max-width: 576px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
    xxl: '(min-width: 1400px)',
  };

export const LAUNDRY_ROOM_STATUS = {
  WASHED: 'Proses Pencucian',
  READY: 'Dalan Antrian',
  FINISHED: 'Proses Selesai',
};

export const LAUNDRY_PAYMENT_STATUS = {
  PENDING: 'Menunggu pembayaran.',
  PROCESSED: 'Pembayaran diproses.',
  REJECTED: 'Pembayaran ditolak.',
  FINISHED: 'Lunas',
};

export const BANKS = [
  {
    name: APP_NAME?.toLocaleLowerCase(),
    bank_name: 'MANDIRI',
    no_rek: '1234567890',
  },
  {
    name: APP_NAME?.toLocaleLowerCase(),
    bank_name: 'BRI',
    no_rek: '0987654321',
  },
  {
    name: APP_NAME?.toLocaleLowerCase(),
    bank_name: 'BCA',
    no_rek: '2468135790',
  },
];

export const PAYMENT_METHODS = [
  { name: 'Transfer', value: 'BANK_TRANSFER' },
  { name: 'Tunai', value: 'CASH' },
];
