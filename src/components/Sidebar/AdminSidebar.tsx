/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import SimpleBar from 'simplebar-react';
import clsx from 'classnames';
import { useAdminLayoutContext } from '@utils/context/AdminLayoutContext';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import useSidebarNavigation from '@hooks/useSidebarNavigation';
import { IUserAuth } from '@interfaces';
import SidebarBrand from './SidebarBrand';
import SidebarHeader from './SidebarHeader';
import SidebarItem from './SidebarItem';
import SidebarItemCollapse from './SidebarItemCollapse';

type Props = {};

export default function AdminSidebar({}: Props) {
  const scrollableNodeRef = React.createRef<any>();
  const ref = React.useRef<any>();

  const { openSidebar } = useAdminLayoutContext();
  const userAuth = useUserAuthContext();
  const navigations = useSidebarNavigation({
    userAuth: userAuth?.user as IUserAuth,
  });

  React.useEffect(() => {
    ref?.current?.recalculate();
  }, []);

  const sidebarClassName = clsx('sidebar', {
    collapsed: openSidebar,
  });

  return (
    <nav id="sidebar" className={sidebarClassName}>
      <SimpleBar
        scrollableNodeProps={{ ref: scrollableNodeRef }}
        className="sidebar-content border-dark  "
      >
        <SidebarBrand />
        <ul className="sidebar-nav">
          {userAuth?.user
            ? Object.keys(navigations).map((key) => {
                return (
                  <React.Fragment key={key}>
                    <SidebarHeader title={navigations[key].title} />
                    {navigations[key].navItems.map((nv, idx) => {
                      const navKey = idx;

                      if (nv?.navSubItems) {
                        return (
                          <SidebarItemCollapse
                            key={navKey}
                            name={nv.name}
                            icon={nv.icon}
                            links={nv.navSubItems}
                          />
                        );
                      }
                      return (
                        <SidebarItem
                          name={nv.name}
                          icon={nv.icon}
                          href={nv?.href ?? '#/'}
                          key={navKey}
                          badge={nv.badge}
                          disabled={nv.disabled}
                          bagdeColor={nv.bagdeColor}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })
            : null}
        </ul>
        {/* <SidebarCta /> */}
      </SimpleBar>
    </nav>
  );
}
