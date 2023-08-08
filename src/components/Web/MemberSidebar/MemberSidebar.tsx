// memberProfileNavigationConfigs
import React from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import { memberNavigationConfigs } from '@configs/navigationConfigs';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {};

function MemberSidebar({}: Props) {
  const router = useRouter();

  return (
    <Nav
      variant="pills"
      className="flex-column member-siderbar-nav "
      defaultActiveKey="/m/dashboard"
    >
      {memberNavigationConfigs.map((item, idx) => {
        const key = idx;
        return (
          <Link legacyBehavior key={key} passHref href={item.href}>
            <Nav.Link
              active={router.pathname?.includes(item.href)}
              className={clsx(
                ' font-opensans d-flex align-items-center justify-content-start  '
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="me-2 fa-fw" />
              {item.name}
            </Nav.Link>
          </Link>
        );
      })}
    </Nav>
  );
}

export default MemberSidebar;
