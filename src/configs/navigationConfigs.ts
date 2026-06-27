/* eslint-disable no-restricted-syntax */
import {
  faBagShopping,
  faBell,
  faChartBar,
  faExchangeAlt,
  faTShirt,
  faUser,
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
    title: 'Cucian',
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
      // {
      //   name: 'Promo',
      //   icon: 'Tag',
      //   href: '/admin/laundry/promo',
      //   permissions: ['*'],
      // },
      {
        name: 'Pelanggan',
        icon: 'LucideBookUser',
        href: '/admin/laundry/pelanggan',
        permissions: ['ADMIN', 'OFFICER'],
      },
    ],
  },
  user: {
    title: 'Manajemen User',
    navItems: [
      {
        name: 'Staff',
        icon: 'ShieldUser',
        href: '/admin/laundry/user',
        permissions: ['ADMIN'],
      },
      {
        name: 'Member',
        icon: 'Users',
        href: '/admin/laundry/member',
        permissions: ['ADMIN'],
      },
    ],
  },
  settings: {
    title: 'Pengaturan',
    navItems: [
      {
        icon: 'Settings',
        name: 'Pengaturan',
        href: '/admin/pengaturan',
        permissions: ['ADMIN'],
      },
      {
        icon: 'Bell',
        name: 'Template Notifikasi',
        href: '/admin/template-notifikasi',
        permissions: ['ADMIN'],
      },
      {
        icon: 'FileText',
        name: 'Audit Log',
        href: '/admin/audit-log',
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
            href: '/admin/laporan/transaksi',
            permissions: ['ADMIN', 'OFFICER'],
          },
          {
            name: 'Laporan Kas',
            href: '/admin/laporan/kas',
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

export const memberNavigationGroups = [
  {
    title: 'Menu',
    items: [
      { name: 'Dashboard', href: '/m/dashboard', icon: faChartBar },
      // { name: 'Pesan Cucian', href: '/m/pemesanan', icon: faCartPlus },
      { name: 'Antrian', href: '/m/antrian', icon: faBagShopping },
      { name: 'Cucian', href: '/m/cucian', icon: faTShirt },
      { name: 'Transaksi', href: '/m/transaksi', icon: faExchangeAlt },
      { name: 'Notifikasi', href: '/m/notifications', icon: faBell },
    ],
  },
  {
    title: 'Akun',
    items: [{ name: 'Profile', href: '/m/profile', icon: faUser }],
  },
];

export const memberNavigationConfigs = memberNavigationGroups.flatMap(
  (group) => group.items
);

// Dashboard is the index route, so it must match exactly; nested routes
// (e.g. /m/cucian/[id]) should still highlight their parent item.
export const isMemberNavActive = (pathname: string, href: string): boolean => {
  if (href === '/m/dashboard') return pathname === href;
  return pathname.startsWith(href);
};

export default navigationConfigs;
