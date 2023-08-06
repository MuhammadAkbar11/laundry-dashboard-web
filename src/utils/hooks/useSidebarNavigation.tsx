import navigationConfigs from '@configs/navigationConfigs';
import { INavigation, INavigationItem, IUserAuth } from '@interfaces';
import React from 'react';

type Props = { userAuth: IUserAuth };

function useSidebarNavigation(props: Props) {
  const [sidebarNavigationsConfigs, setSidebarNavigationsConfigs] =
    React.useState<INavigation>({});

  const userAuth = props?.userAuth as IUserAuth;
  React.useEffect(() => {
    let filteredNavConfigs: INavigation;

    if (userAuth) {
      filteredNavConfigs = Object.entries(
        navigationConfigs
      ).reduce<INavigation>((acc, [key, { title, navItems }]) => {
        const filteredNavItems = navItems.reduce<INavigationItem[]>(
          (items, item) => {
            const itemPermissions = item?.permissions as string[];
            const filteredItem: INavigationItem = { ...item };
            if (item.navSubItems) {
              filteredItem.navSubItems = item.navSubItems.filter(
                (subItem) =>
                  subItem.permissions?.includes('*') ||
                  subItem.permissions?.includes(userAuth.role)
              );
              items.push(filteredItem);
            }

            if (!item.navSubItems) {
              if (
                itemPermissions?.includes('*') ||
                itemPermissions?.includes(userAuth.role)
              ) {
                items.push(filteredItem);
              }
            }

            return items;
          },
          []
        );
        if (filteredNavItems.length > 0) {
          acc[key] = {
            title,
            navItems: filteredNavItems,
          };
        }
        return acc;
      }, {});

      setSidebarNavigationsConfigs(filteredNavConfigs);
    }
  }, [userAuth]);

  return sidebarNavigationsConfigs;
}

useSidebarNavigation.defaultProps = {
  userAuth: null,
};

export default useSidebarNavigation;
