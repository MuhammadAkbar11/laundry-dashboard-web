import React from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import {
  isMemberNavActive,
  memberNavigationGroups,
} from '@configs/navigationConfigs';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MemberSidebarProfile from './MemberSidebarProfile';

type Props = {};

function MemberSidebar({}: Props) {
  const router = useRouter();

  return (
    <div className="member-sidebar-sticky">
      <MemberSidebarProfile />
      {memberNavigationGroups.map((group, idx) => (
        <div key={group?.title || idx} className="mb-3">
          <p className="member-sidebar-group-title text-uppercase text-muted fw-semibold mb-1">
            {group.title}
          </p>
          <Nav variant="pills" className="flex-column member-siderbar-nav">
            {group.items.map((item) => (
              <Link legacyBehavior key={item.href} passHref href={item.href}>
                <Nav.Link
                  active={isMemberNavActive(router.pathname, item.href)}
                  className={clsx(
                    'font-opensans d-flex align-items-center justify-content-start'
                  )}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2 fa-fw" />
                  {item.name}
                </Nav.Link>
              </Link>
            ))}
          </Nav>
        </div>
      ))}
    </div>
  );
}

export default MemberSidebar;
