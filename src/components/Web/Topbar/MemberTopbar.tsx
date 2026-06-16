import React from 'react';
import Link from 'next/link';
import { IMemberAuth } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import { Button, Container, Row, Col } from 'react-bootstrap';
import MemberDropdownProfile from '@components/Web/Dropdowns/MemberDropdownProfile';
import LoadingPulse from '@components/Utils/LoadingPulse';
import LogoSmall from '@components/Logo/LogoSmall';
import MemberNotificationBell from '@features/member/notifications/MemberNotificationBell';
import { useWebLayoutContext } from '@utils/context/WebLayoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type Props = {};

function MemberTopbar({}: Props) {
  const memberAuthCtx = useMemberAuthContext();
  const layoutCtx = useWebLayoutContext();

  const { member: profile, isLoading: authLoading } = memberAuthCtx;

  return (
    <Container fluid className="bg-accent1 py-2 px-md-4 sticky-top">
      <Container>
        <Row className="align-items-center">
          <Col
            xs={6}
            className="text-center text-md-start d-flex align-items-center gap-2"
          >
            <Button
              variant="link"
              aria-label="Buka menu"
              onClick={() => layoutCtx.onToggleMemberSidebar()}
              className="d-md-none p-0 text-white border-0 lh-1"
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </Button>
            <Link
              href="/"
              className="h3 m-0 text-white d-flex gap-2 fw-bolder text-decoration-none"
            >
              <LogoSmall height={28} width={28} />
            </Link>
          </Col>
          <Col
            xs={6}
            className="text-center text-md-end d-flex justify-content-end align-items-center gap-1"
          >
            {authLoading ? (
              <LoadingPulse />
            ) : (
              <>
                {profile ? <MemberNotificationBell /> : null}
                <MemberDropdownProfile
                  isLogin={!!profile}
                  profile={profile as IMemberAuth}
                  isDashboard
                />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default MemberTopbar;
