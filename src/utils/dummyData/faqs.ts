export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  name: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: 'general',
    name: 'Umum',
    items: [
      {
        question: 'Apa itu CusCuciin?',
        answer:
          'CusCuciin adalah platform laundry online yang membantu Anda memesan, melacak, dan menyelesaikan pencucian tanpa harus datang ke lokasi. Cukup pesan melalui website, kami akan menjemput dan mengantar kembali cucian Anda.',
      },
      {
        question: 'Di area mana CusCuciin beroperasi?',
        answer:
          'Saat ini CusCuciin melayani area tertentu. Silakan cek halaman Kontak atau hubungi kami untuk memastikan apakah lokasi Anda termasuk dalam cakupan layanan.',
      },
      {
        question: 'Bagaimana cara menghubungi customer support?',
        answer:
          'Anda dapat menghubungi kami melalui halaman Kontak, email, atau telepon yang tertera di website. Tim support siap membantu Anda setiap hari kerja.',
      },
    ],
  },
  {
    id: 'laundry-services',
    name: 'Layanan Laundry',
    items: [
      {
        question: 'Jenis layanan laundry apa saja yang tersedia?',
        answer:
          'Kami menyediakan layanan cuci kering (dry clean), cuci setrika reguler, cuci express, dan layanan khusus untuk item tertentu seperti selimut, bed cover, dan sepatu. Detail lengkap bisa dilihat di halaman Layanan.',
      },
      {
        question: 'Berapa lama proses laundry?',
        answer:
          'Layanan reguler membutuhkan 2-3 hari kerja, sedangkan layanan express dapat selesai dalam 1 hari kerja. Waktu pemrosesan dapat berbeda tergantung volume cucian dan jenis layanan yang dipilih.',
      },
      {
        question: 'Apakah cucian saya dicampur dengan milik orang lain?',
        answer:
          'Tidak. Setiap cucian diproses secara terpisah dan diberi label dengan ID antrian Anda untuk memastikan tidak tercampur dengan cucian pelanggan lain.',
      },
    ],
  },
  {
    id: 'pickup-delivery',
    name: 'Jemput & Antar',
    items: [
      {
        question: 'Bagaimana sistem jemput dan antar bekerja?',
        answer:
          'Saat memesan, pilih opsi Delivery. Tim kami akan menjemput cucian Anda sesuai jadwal yang dipilih, memprosesnya, lalu mengantar kembali ke alamat tujuan setelah selesai.',
      },
      {
        question: 'Apakah ada biaya untuk jemput dan antar?',
        answer:
          'Biaya jemput-antar dapat bervariasi tergantung jarak lokasi. Detail biaya akan ditampilkan saat Anda melakukan pemesanan.',
      },
      {
        question:
          'Bagaimana jika saya tidak ada di lokasi saat penjemputan/pengantaran?',
        answer:
          'Pastikan seseorang mewakili Anda di lokasi, atau berikan instruksi khusus melalui kolom catatan saat memesan. Untuk pengambilan sendiri, pilih opsi Self Pickup.',
      },
    ],
  },
  {
    id: 'orders',
    name: 'Pemesanan',
    items: [
      {
        question: 'Bagaimana cara melakukan pemesanan?',
        answer:
          'Anda dapat memesan melalui halaman Pemesanan di website. Pilih layanan, tentukan tanggal penjemputan, isi alamat, lalu konfirmasi pesanan. Anda akan menerima ID antrian untuk pelacakan.',
      },
      {
        question: 'Bagaimana cara melacak status pesanan saya?',
        answer:
          'Login ke akun member Anda, lalu buka menu Antrian atau Cucian. Status pesanan akan diperbarui secara real-time dari PENDING hingga FINISHED.',
      },
      {
        question: 'Apakah saya bisa membatalkan pesanan?',
        answer:
          'Pesanan dapat dibatalkan selama status masih PENDING dan belum diproses. Silakan hubungi customer support kami untuk membantu pembatalan.',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Pembayaran',
    items: [
      {
        question: 'Metode pembayaran apa saja yang diterima?',
        answer:
          'Kami menerima pembayaran tunai (CASH) dan transfer bank. Metode pembayaran lainnya akan tersedia di masa mendatang.',
      },
      {
        question: 'Kapan saya harus membayar?',
        answer:
          'Pembayaran dilakukan setelah cucian selesai diproses. Untuk layanan tunai, bayar langsung saat pengantaran. Untuk transfer, lakukan pembayaran sebelum cucian diantar.',
      },
      {
        question: 'Apakah saya mendapatkan bukti pembayaran?',
        answer:
          'Ya. Setelah pembayaran berhasil, Anda akan menerima invoice dengan nomor unik yang dapat diakses melalui menu Transaksi di akun member Anda.',
      },
    ],
  },
  {
    id: 'member-account',
    name: 'Akun Member',
    items: [
      {
        question: 'Bagaimana cara mendaftar akun member?',
        answer:
          'Klik tombol Daftar di halaman utama, isi data diri Anda (nama, email, password, alamat), lalu verifikasi email. Setelah verifikasi, akun member Anda aktif dan siap digunakan.',
      },
      {
        question: 'Apa keuntungan menjadi member?',
        answer:
          'Member dapat melacak pesanan, melihat riwayat transaksi, mengakses invoice, mengumpulkan poin reward, dan menikmati promo khusus yang tidak tersedia untuk non-member.',
      },
      {
        question: 'Bagaimana cara mengubah data profil saya?',
        answer:
          'Login ke akun member, buka menu Profile, lalu perbarui nama, alamat, atau nomor telepon Anda. Perubahan akan langsung tersimpan.',
      },
    ],
  },
  {
    id: 'promotions-points',
    name: 'Promosi & Poin',
    items: [
      {
        question: 'Bagaimana cara mendapatkan poin reward?',
        answer:
          'Anda mendapatkan poin setiap kali menyelesaikan pesanan. Jumlah poin bergantung pada level keanggotaan Anda. Semakin tinggi level, semakin banyak poin yang diperoleh per transaksi.',
      },
      {
        question: 'Untuk apa poin reward digunakan?',
        answer:
          'Poin reward dapat ditukar dengan diskon pada pesanan berikutnya. Semakin banyak poin yang Anda kumpulkan, semakin besar potongan yang bisa didapat.',
      },
      {
        question: 'Apakah ada program loyalitas atau level member?',
        answer:
          'Ya. Kami memiliki beberapa level member (Basic, Gold, Platinum) yang menawarkan benefit berbeda seperti diskon lebih besar dan poin ekstra per transaksi.',
      },
    ],
  },
];
