import React from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import {
  isMemberNavActive,
  memberNavigationGroups,
} from '@configs/navigationConfigs';
import { Nav, Offcanvas } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQuery from '@hooks/useMediaQuery';
import { useWebLayoutContext } from '@utils/context/WebLayoutContext';
import MemberSidebarProfile from './MemberSidebarProfile';

type Props = {};

function MemberSidebarMobile({}: Props) {
  const router = useRouter();
  const mdScreen = useMediaQuery('md-max');
  const layoutCtx = useWebLayoutContext();

  const handleClose = () => {
    layoutCtx.onToggleMemberSidebar();
  };

  return (
    <Offcanvas
      show={layoutCtx.openMemberSidebar && mdScreen}
      onHide={handleClose}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="font-opensans fw-bolder text-accent1">
          Menu
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <MemberSidebarProfile />
        {memberNavigationGroups.map((group) => (
          <div key={group.title} className="mb-3">
            <p className="member-sidebar-group-title text-uppercase text-muted fw-semibold mb-1">
              {group.title}
            </p>
            <Nav variant="pills" className="flex-column member-siderbar-nav">
              {group.items.map((item) => (
                <Link legacyBehavior key={item.href} passHref href={item.href}>
                  <Nav.Link
                    onClick={handleClose}
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
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MemberSidebarMobile;
