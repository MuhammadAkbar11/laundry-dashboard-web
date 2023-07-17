/* eslint-disable no-restricted-syntax */
import {
  faBagShopping,
  faCartFlatbed,
  faChartBar,
  // faClock,
  faExchangeAlt,
  faTShirt,
} from '@fortawesome/free-solid-svg-icons';
import { INavigation } from '@interfaces';

const navigationConfigs: INavigation = {
  pages: {
    title: 'Dashboard',
    navItems: [
      {
        name: 'Dashboard',
        icon: 'Sliders',
        href: '/admin',
        permissions: ['*'],
      },
    ],
  },
  laundry: {
    title: 'Laundry',
    navItems: [
      {
        name: 'Antrian',
        icon: 'Clipboard',
        href: '/admin/laundry/antrian',
        permissions: ['*'],
      },
      {
        name: 'Ruang Laundry',
        icon: 'RefreshCcw',
        href: '/admin/laundry/room',
        permissions: ['*'],
      },
      {
        name: 'Layanan / Kategori',
        icon: 'ShoppingBag',
        href: '/admin/laundry/layanan',
        permissions: ['*'],
      },
      {
        name: 'Promo',
        icon: 'Tag',
        href: '/admin/laundry/promo',
        permissions: ['*'],
      },
      {
        name: 'Pelanggan',
        icon: 'UserCheck',
        href: '/admin/laundry/pelanggan',
        permissions: ['ADMIN', 'OFFICER'],
      },
      {
        name: 'User',
        icon: 'Users',
        href: '/admin/laundry/user',
        permissions: ['ADMIN'],
      },
    ],
  },
  transactions: {
    title: 'Transaksi & Laporan',
    navItems: [
      {
        name: 'Transaksi',
        icon: 'File',
        navSubItems: [
          {
            name: 'Semua Transaksi',
            href: '/admin/transaksi',
            permissions: ['ADMIN'],
          },
          {
            name: 'Riwayat Transaksi',
            href: '/admin/transaksi/riwayat',
            permissions: ['ADMIN', 'OFFICER'],
          },
        ],
      },
      {
        icon: 'ShoppingCart',
        name: 'Pengeluaran',
        href: '/admin/pengeluaran',
        permissions: ['ADMIN', 'OFFICER'],
      },
      {
        name: 'Laporan',
        icon: 'FileText',
        navSubItems: [
          {
            name: 'Laporan Transaksi',
            href: '/admin/laporan',
            permissions: ['ADMIN', 'OFFICER'],
          },
          {
            name: 'Laporan Kas',
            href: '/admin/kas',
            permissions: ['ADMIN', 'OFFICER'],
          },
        ],
      },
    ],
  },
};

export const memberProfileNavigationConfigs = [
  { text: 'Profile', href: '/m/profile' },
  { text: 'Dashboard', href: '/m/dashboard' },
  { text: 'Pengaturan', href: '/m/pengaturan' },
];

export const memberNavigationConfigs = [
  {
    name: 'Dashboard',
    href: '/m/dashboard',
    icon: faChartBar,
  },
  {
    name: 'Antrian',
    href: '/m/antrian',
    icon: faBagShopping,
  },
  {
    name: 'Cucian',
    href: '/m/cucian',
    icon: faTShirt,
  },
  {
    name: 'Transaksi',
    href: '/m/transaksi',
    icon: faExchangeAlt,
  },
];

export default navigationConfigs;
