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
    xs: '(max-width: 576px)', // X-Small devices (portrait phones, less than 576px)
    'sm-max': '(max-width: 575.98px)', // Small devices and smaller
    'sm-min': '(min-width: 576px)', // Small devices and larger
    'md-max': '(max-width: 767.98px)', // Medium devices and smaller
    'md-min': '(min-width: 768px)', // Medium devices and larger
    'lg-max': '(max-width: 991.98px)', // Large devices and smaller
    'lg-min': '(min-width: 992px)', // Large devices and larger
    'xl-max': '(max-width: 1199.98px)', // X-Large devices and smaller
    'xl-min': '(min-width: 1200px)', // X-Large devices and larger
    'xxl-max': '(max-width: 1399.98px)', // XX-Large devices and smaller
    'xxl-min': '(min-width: 1400px)', // XX-Large devices and larger
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
