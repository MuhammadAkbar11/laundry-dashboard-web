import { LucideIconTypes } from '@utils/types';

export type SupportChannel = {
  id: string;
  icon: LucideIconTypes;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export const supportChannels: SupportChannel[] = [
  {
    id: 'whatsapp',
    icon: 'MessageCircle',
    title: 'WhatsApp',
    description:
      'Chat langsung dengan tim support kami untuk bantuan cepat dan respons real-time.',
    ctaLabel: 'Chat WhatsApp',
    href: 'https://wa.me/6285234566789',
  },
  {
    id: 'email',
    icon: 'Mail',
    title: 'Email',
    description:
      'Kirim email untuk pertanyaan detail atau masalah yang membutuhkan dokumentasi.',
    ctaLabel: 'Kirim Email',
    href: 'mailto:customercuciin@gmail.com',
  },
  {
    id: 'phone',
    icon: 'Phone',
    title: 'Telepon',
    description:
      'Hubungi kami langsung via telepon untuk urusan mendesak atau konfirmasi cepat.',
    ctaLabel: 'Telepon Sekarang',
    href: 'tel:+6285234566789',
  },
];

export type BusinessHours = {
  days: string;
  hours: string;
  responseTime: string;
};

export const businessHours: BusinessHours = {
  days: 'Senin - Minggu (termasuk hari libur)',
  hours: '08.00 - 21.00 WIB',
  responseTime: '1-2 jam pada jam kerja, maksimal 1x24 jam',
};

export type SupportInfoItem = {
  title: string;
  description: string;
};

export const beforeContactingTips: SupportInfoItem[] = [
  {
    title: 'Cek FAQ',
    description:
      'Banyak pertanyaan umum sudah terjawab di halaman FAQ. Cek terlebih dahulu sebelum menghubungi support.',
  },
  {
    title: 'Baca Panduan',
    description:
      'Halaman Bantuan menyediakan tutorial langkah demi langkah untuk menggunakan seluruh fitur CusCuciin.',
  },
  {
    title: 'Pastikan Akun Aktif',
    description:
      'Verifikasi bahwa akun member Anda sudah terverifikasi dan dalam status aktif.',
  },
];

export const infoToPrepare: SupportInfoItem[] = [
  {
    title: 'ID Antrian atau Invoice',
    description:
      'Siapkan nomor ID Antrian atau Invoice terkait masalah Anda agar tim support dapat menelusuri dengan cepat.',
  },
  {
    title: 'Data Akun',
    description:
      'Siapkan email atau nomor telepon yang terdaftar di akun member Anda.',
  },
  {
    title: 'Deskripsi Masalah',
    description:
      'Jelaskan masalah secara detail: kapan terjadi, langkah yang sudah dilakukan, dan pesan error jika ada.',
  },
];

export const commonScenarios: SupportInfoItem[] = [
  {
    title: 'Pesanan Tidak Terupdate',
    description:
      'Status pesanan belum berubah meski sudah melewati estimasi waktu pemrosesan.',
  },
  {
    title: 'Pembayaran Tidak Terdeteksi',
    description:
      'Pembayaran sudah dilakukan tetapi status transaksi masih belum berubah menjadi lunas.',
  },
  {
    title: 'Tidak Bisa Login',
    description:
      'Tidak dapat mengakses akun member karena lupa password atau akun terkunci.',
  },
  {
    title: 'Cucian Rusak atau Hilang',
    description:
      'Item cucian mengalami kerusakan atau tidak diterima setelah pengantaran.',
  },
];
