import { FeatherIconsTypes, ThemeTypes } from '@utils/types';

interface INavigationSubItems {
  name: string;
  href: string;
  badge?: string;
  bagdeColor?: ThemeTypes;
  disabled?: boolean;
}

interface INavigationItem {
  name: string;
  icon: FeatherIconsTypes;
  href?: string;
  disabled?: boolean;
  badge?: string;
  bagdeColor?: ThemeTypes;
  navSubItems?: INavigationSubItems[];
}

interface INavigation {
  [key: string]: {
    title: string;
    navItems: INavigationItem[];
  };
}

const navigationConfigs: INavigation = {
  pages: {
    title: 'Dashboard',
    navItems: [
      {
        name: 'Dashboard',
        icon: 'Sliders',
        href: '/',
      },
    ],
  },
  laundry: {
    title: 'Laundry',
    navItems: [
      {
        name: 'Antrian',
        icon: 'Clipboard',
        href: '/laundry/antrian',
      },
      {
        name: 'Ruang Laundry',
        icon: 'RefreshCcw',
        href: '/laundry/ruang-laundry',
      },
      {
        name: 'Layanan / Kategori',
        icon: 'ShoppingBag',
        href: '/laundry/layanan',
      },
      {
        name: 'Promo',
        icon: 'Tag',
        href: '/laundry/promo',
      },
      {
        name: 'Pelanggan',
        icon: 'UserCheck',
        href: '/laundry/pelanggan',
      },
      {
        name: 'User',
        icon: 'Users',
        href: '/laundry/user',
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
            href: '/transaksi',
          },
          {
            name: 'Riwayat Transaksi',
            href: '/transaksi/riwayat',
          },
        ],
      },
      {
        icon: 'ShoppingCart',
        name: 'Pengeluaran',
        href: '/laundry/user',
      },
      {
        name: 'Laporan',
        icon: 'FileText',
        navSubItems: [
          {
            name: 'Laporan Transaksi',
            href: '/laundry/user',
          },
          {
            name: 'Laporan Kas',
            href: '/laundry/user',
          },
        ],
      },
    ],
  },

  // toolsComponents: {
  //   title: 'Tools & Components',
  //   navItems: [
  //     {
  //       name: 'UI Elements',
  //       icon: 'Briefcase',
  //       navSubItems: [
  //         {
  //           name: 'Alerts',
  //           href: '/ui-alerts',
  //           badge: 'Soon',
  //           disabled: true,
  //         },
  //         {
  //           name: 'Buttons',
  //           href: '/ui-buttons',
  //           badge: 'Soon',
  //           disabled: true,
  //         },
  //         {
  //           name: 'Cards',
  //           href: '/ui-cards',
  //           badge: 'Soon',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       name: 'Forms',
  //       icon: 'CheckSquare',
  //       badge: 'Soon',
  //       disabled: true,
  //       href: '/ui-forms',
  //     },
  //     {
  //       name: 'Icons',
  //       icon: 'Coffee',

  //       href: '/ui-feather',
  //     },
  //   ],
  // },
  // pluginsAddons: {
  //   title: 'Plugins & Addons',
  //   navItems: [
  //     {
  //       name: 'Notification',
  //       icon: 'Bell',
  //       href: '/notification',
  //     },
  //     {
  //       name: 'Table',
  //       icon: 'List',
  //       href: '/tables-react',
  //     },
  //     {
  //       name: 'Charts',
  //       icon: 'BarChart2',
  //       href: '/charts-chartjs',
  //       badge: 'Soon',
  //       disabled: true,
  //     },
  //     {
  //       name: 'Map',
  //       icon: 'Map',
  //       navSubItems: [
  //         {
  //           name: 'Google Map',
  //           href: '/map-google',
  //           badge: 'Soon',
  //           disabled: true,
  //         },
  //         {
  //           name: 'JVectorMap',
  //           href: '/map-jvectormap',
  //           badge: 'Soon',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //   ],
  // },
};

export default navigationConfigs;
