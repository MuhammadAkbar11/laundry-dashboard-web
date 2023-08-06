import React from 'react';
import Footer from '@components/Web/Footer/Footer';
import WebModalConfirmationSignOut from '@components/Web/Modals/WebModalConfirmationSignOut';
import MemberProfileHeader from '@components/Web/MemberProfileHeader';
import MemberTopbar from '@components/Web/Topbar/MemberTopbar';
import useMediaQuery from '@hooks/useMediaQuery';
import { Col, Container, Row } from 'react-bootstrap';
import clsx from 'classnames';
import MemberSidebar from '@components/Web/MemberSidebar/MemberSidebar';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import { IMemberPageProps } from '@interfaces';

type Props = {
  children: React.ReactNode;
} & IMemberPageProps;

function WebMemberLayout({ children, memberAuth }: Props) {
  const mdScreen = useMediaQuery('md');

  const memberAuthCtx = useMemberAuthContext();
  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  return (
    <>
      <MemberTopbar />
      <div
        className=" font-opensans container-fluid bg-white "
        style={{ minHeight: '100vh' }}
      >
        <MemberProfileHeader />
        <Container className="px-lg-3 pt-0">
          <Row>
            <Col md={3} className={clsx({ 'd-none': !mdScreen })}>
              <MemberSidebar />
            </Col>
            <Col md={9} className="ps-md-3">
              {children}
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
      <WebModalConfirmationSignOut />
    </>
  );
}

export default WebMemberLayout;
