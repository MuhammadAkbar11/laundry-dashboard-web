import navigationConfigs from './navigationConfigs';

interface IPageConfig {
  path: string;
  permissions?: string[];
  isDynamicPage?: boolean;
}

const permissionNavigationConfigs: IPageConfig[] = Object.values(
  navigationConfigs
).reduce<IPageConfig[]>((acc, { navItems }) => {
  const filteredNavItems = navItems.reduce((items, item) => {
    const { href, permissions } = item;
    if (href && permissions) {
      items.push({ path: href, permissions });
    }

    if (item.navSubItems) {
      const filteredSubItems = item.navSubItems.reduce((subItems, subItem) => {
        const { href: subHref, permissions: subPermissions } = subItem;
        if (subHref && subPermissions) {
          subItems.push({ path: subHref, permissions: subPermissions });
        }
        return subItems;
      }, [] as IPageConfig[]);
      items.push(...filteredSubItems);
    }

    return items;
  }, [] as IPageConfig[]);

  acc.push(...filteredNavItems);
  return acc;
}, []);

const pagesConfigs: IPageConfig[] = [
  ...permissionNavigationConfigs,
  { path: '/admin/profile', permissions: ['*'] },
  { path: '/admin/laundry/room/', permissions: ['*'], isDynamicPage: true },
  { path: '/admin/laundry/bayar/', permissions: ['*'], isDynamicPage: true },
  { path: '/admin/transaksi/', permissions: ['*'], isDynamicPage: true },
];

export default pagesConfigs;
