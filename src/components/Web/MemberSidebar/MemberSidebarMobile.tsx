import React from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import { memberNavigationConfigs } from '@configs/navigationConfigs';
import { Nav, Offcanvas } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQuery from '@hooks/useMediaQuery';
import { useWebLayoutContext } from '@utils/context/WebLayoutContext';

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
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
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
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MemberSidebarMobile;
