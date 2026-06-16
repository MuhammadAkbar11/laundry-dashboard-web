import React from 'react';
import MemberFooter from '@components/Web/Footer/MemberFooter';
import WebModalConfirmationSignOut from '@components/Web/Modals/WebModalConfirmationSignOut';
import MemberTopbar from '@components/Web/Topbar/MemberTopbar';
import useMediaQuery from '@hooks/useMediaQuery';
import { Col, Container, Row } from 'react-bootstrap';
import clsx from 'classnames';
import MemberSidebar from '@components/Web/MemberSidebar/MemberSidebar';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import { IMemberPageProps } from '@interfaces';
import MemberSidebarMobile from '@components/Web/MemberSidebar/MemberSidebarMobile';

type Props = {
  children: React.ReactNode;
} & IMemberPageProps;

function WebMemberLayout({ children, memberAuth }: Props) {
  const mdScreen = useMediaQuery('md-min');

  const memberAuthCtx = useMemberAuthContext();
  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  return (
    <div className="member-dashboard d-flex flex-column min-vh-100 bg-light">
      <MemberTopbar />
      <div className="font-opensans container-fluid flex-grow-1">
        <Container className="px-lg-3 pt-4 pb-4">
          <Row>
            <Col
              md={3}
              className={clsx('mb-4 mb-md-0', { 'd-none': !mdScreen })}
            >
              <MemberSidebar />
            </Col>
            <Col md={9} className="ps-md-3">
              {children}
            </Col>
          </Row>
        </Container>
      </div>
      <MemberFooter />
      <WebModalConfirmationSignOut />
      <MemberSidebarMobile />
    </div>
  );
}

export default WebMemberLayout;
