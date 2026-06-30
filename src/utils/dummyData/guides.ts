import { LucideIconTypes } from '@utils/types';

export type GuideStep = {
  title: string;
  description: string;
};

export type GuideSection = {
  id: string;
  title: string;
  icon: LucideIconTypes;
  description: string;
  steps: GuideStep[];
};

export const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Memulai',
    icon: 'Rocket',
    description:
      'Pelajari cara mendaftar dan menyiapkan akun member Anda untuk mulai menggunakan CusCuciin.',
    steps: [
      {
        title: 'Daftar Akun',
        description:
          'Klik tombol Daftar di halaman utama, lalu isi data diri Anda: nama, email, password, dan alamat.',
      },
      {
        title: 'Verifikasi Email',
        description:
          'Cek email Anda untuk link verifikasi. Klik link tersebut untuk mengaktifkan akun member.',
      },
      {
        title: 'Lengkapi Profil',
        description:
          'Login ke akun Anda, buka menu Profile, dan pastikan nama, alamat, serta nomor telepon sudah benar.',
      },
    ],
  },
  {
    id: 'first-order',
    title: 'Membuat Pesanan Pertama',
    icon: 'ShoppingCart',
    description:
      'Ikuti langkah-langkah berikut untuk membuat pesanan laundry pertama Anda.',
    steps: [
      {
        title: 'Pilih Layanan',
        description:
          'Buka halaman Pemesanan, pilih jenis layanan laundry yang Anda inginkan (cuci kering, cuci setrika, express, dll).',
      },
      {
        title: 'Tentukan Pengiriman',
        description:
          'Pilih opsi Delivery (jemput-antar) atau Self Pickup (ambil sendiri). Untuk Delivery, isi alamat penjemputan.',
      },
      {
        title: 'Pilih Tanggal',
        description:
          'Tentukan tanggal dan waktu penjemputan cucian Anda sesuai jadwal yang tersedia.',
      },
      {
        title: 'Konfirmasi Pesanan',
        description:
          'Periksa detail pesanan, lalu klik konfirmasi. Anda akan menerima ID Antrian untuk melacak pesanan.',
      },
    ],
  },
  {
    id: 'tracking-laundry',
    title: 'Melacak Laundry',
    icon: 'Search',
    description:
      'Pantau status pesanan Anda dari awal hingga selesai secara real-time.',
    steps: [
      {
        title: 'Buka Menu Antrian',
        description:
          'Login ke akun member Anda, lalu buka menu Antrian atau Cucian di dashboard.',
      },
      {
        title: 'Pilih Pesanan',
        description:
          'Klik ID Antrian yang ingin Anda lacak untuk melihat detail lengkap.',
      },
      {
        title: 'Pantau Status',
        description:
          'Status akan diperbarui dari PENDING → ONHOLD → WASHED → FINISHED. Anda juga akan menerima notifikasi otomatis di setiap perubahan status.',
      },
    ],
  },
  {
    id: 'payment-guide',
    title: 'Panduan Pembayaran',
    icon: 'CreditCard',
    description: 'Cara melakukan pembayaran untuk pesanan laundry Anda.',
    steps: [
      {
        title: 'Tunggu Cucian Selesai',
        description:
          'Pembayaran dilakukan setelah cucian selesai diproses dan status pembayaran berubah menjadi siap dibayar.',
      },
      {
        title: 'Pilih Metode Pembayaran',
        description:
          'Pilih metode pembayaran: tunai (CASH) dibayar saat pengantaran, atau transfer bank.',
      },
      {
        title: 'Lakukan Pembayaran',
        description:
          'Untuk tunai, bayar langsung ke kurir. Untuk transfer, lakukan pembayaran ke rekening yang tertera sebelum cucian diantar.',
      },
      {
        title: 'Simpan Invoice',
        description:
          'Setelah pembayaran berhasil, invoice tersimpan di menu Transaksi akun Anda sebagai bukti pembayaran.',
      },
    ],
  },
  {
    id: 'pickup-delivery-guide',
    title: 'Jemput & Antar',
    icon: 'Truck',
    description: 'Pelajari cara kerja sistem jemput dan antar cucian Anda.',
    steps: [
      {
        title: 'Pilih Opsi Delivery',
        description:
          'Saat memesan, pilih opsi Delivery agar tim kami menjemput dan mengantar cucian Anda.',
      },
      {
        title: 'Siapkan Cucian',
        description:
          'Kumpulkan cucian Anda di lokasi penjemputan sebelum jadwal yang ditentukan.',
      },
      {
        title: 'Proses Laundry',
        description:
          'Tim kami akan memproses cucian Anda dengan label ID Antrian agar tidak tercampur.',
      },
      {
        title: 'Pengantaran',
        description:
          'Setelah selesai, cucian akan diantar kembali ke alamat tujuan dalam kondisi bersih dan rapi.',
      },
    ],
  },
  {
    id: 'member-dashboard',
    title: 'Menggunakan Dashboard Member',
    icon: 'LayoutDashboard',
    description:
      'Kenali fitur-fitur dashboard member untuk mengelola pesanan dan akun Anda.',
    steps: [
      {
        title: 'Dashboard Utama',
        description:
          'Lihat ringkasan pesanan aktif, statistik cucian, dan notifikasi terbaru di halaman utama dashboard.',
      },
      {
        title: 'Menu Antrian',
        description:
          'Akses semua pesanan Anda, filter berdasarkan status, dan lihat detail setiap antrian.',
      },
      {
        title: 'Menu Transaksi',
        description:
          'Lihat riwayat semua transaksi dan invoice pembayaran yang telah selesai.',
      },
      {
        title: 'Pengaturan Profil',
        description:
          'Perbarui data diri, alamat, dan nomor telepon melalui menu Profile kapan saja.',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifikasi',
    icon: 'Bell',
    description:
      'Aktifkan dan kelola notifikasi untuk selalu mendapatkan info terbaru.',
    steps: [
      {
        title: 'Notifikasi Otomatis',
        description:
          'Anda akan menerima notifikasi otomatis saat pesanan dibuat, status berubah, dan pembayaran selesai.',
      },
      {
        title: 'Pusat Notifikasi',
        description:
          'Buka menu Notifikasi di dashboard member untuk melihat semua notifikasi yang masuk.',
      },
      {
        title: 'Tandai Dibaca',
        description:
          'Klik notifikasi untuk menandainya sebagai dibaca, atau gunakan Tandai Semua Dibaca untuk membersihkan semua sekaligus.',
      },
    ],
  },
  {
    id: 'reward-points',
    title: 'Poin Reward',
    icon: 'Gift',
    description:
      'Pelajari cara mengumpulkan dan menggunakan poin reward untuk mendapatkan diskon.',
    steps: [
      {
        title: 'Kumpulkan Poin',
        description:
          'Setiap transaksi yang selesai memberikan poin reward. Jumlah poin bergantung pada level keanggotaan Anda.',
      },
      {
        title: 'Naik Level',
        description:
          'Semakin banyak transaksi, semakin tinggi level member Anda (Basic → Gold → Platinum) dengan benefit lebih besar.',
      },
      {
        title: 'Tukar Poin',
        description:
          'Gunakan poin yang terkumpul untuk mendapatkan diskon pada pesanan berikutnya.',
      },
    ],
  },
];
