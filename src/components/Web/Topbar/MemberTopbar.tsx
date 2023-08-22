import React from 'react';
import Link from 'next/link';
import { IMemberAuth } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import MemberDropdownProfile from '@components/Web/Dropdowns/MemberDropdownProfile';
import LoadingPulse from '@components/Utils/LoadingPulse';
import LogoSmall from '@components/Logo/LogoSmall';

type Props = {};

function MemberTopbar({}: Props) {
  const memberAuthCtx = useMemberAuthContext();

  const { member: profile, isLoading: authLoading } = memberAuthCtx;

  return (
    <Container fluid className="bg-accent1 py-2 px-md-4">
      <Container>
        <Row>
          <Col
            xs={6}
            className="text-center text-md-start d-flex align-items-center "
          >
            <Link
              href="/"
              className=" h3 m-0 text-white d-flex gap-2 fw-bolder text-decoration-none "
            >
              <LogoSmall height={28} width={28} />
            </Link>
          </Col>
          <Col
            xs={6}
            className="text-center text-md-end d-flex justify-content-end "
          >
            {authLoading ? (
              <LoadingPulse />
            ) : (
              <MemberDropdownProfile
                isLogin={!!profile}
                profile={profile as IMemberAuth}
                isDashboard
              />
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default MemberTopbar;
