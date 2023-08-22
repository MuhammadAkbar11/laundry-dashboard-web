/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import clsx from 'classnames';
import { Col, Container, Row } from 'react-bootstrap';
// import Image from 'next/image';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import LoadingPulse from '@components/Utils/LoadingPulse';
import { API_URI } from '@configs/varsConfig';

type Props = {};

function MemberProfileHeader({}: Props) {
  const memberAuthCtx = useMemberAuthContext();

  const { member: profile, isLoading: authLoading } = memberAuthCtx;

  const avatar = profile?.avatar
    ? `${API_URI}${profile?.avatar}`
    : '/img/avatars/avatar-1.png';

  return (
    <div className=" font-opensans bg-white ">
      <Container className={clsx('px-lg-3 pb-4 pt-4')}>
        <Row className={clsx('align-items-center align-content-stretch')}>
          <Col md={7} className="d-flex  mb-3 mb-md-0 ">
            {/* <div>
              {' '}
              {authLoading ? (
                <LoadingPulse width={55} height={55} />
              ) : (
                <Image
                  src={avatar}
                  width={45}
                  height={45}
                  alt="memberSidebarAvatar"
                  className="img-fluid rounded-circle"
                />
              )}
            </div> */}
            <div className="px-0 d-flex flex-column justify-content-center ">
              {' '}
              <h2 className="fw-bolder text-accent1 text-dark m-0  ">
                {profile?.username || '...'}
              </h2>
              <p className=" mb-0 mt-n1 text-muted text-lowercase fst-italic ">
                {profile?.email || '...'}
              </p>
            </div>
          </Col>
          {/* <Col
            md={5}
            className=" d-flex justify-content-start justify-content-md-end px-md-0 "
          >
            <Link legacyBehavior href="/pemesanan" passHref>
              <Button variant="accent1" className="px-3">
                Pesan Sekarang
              </Button>
            </Link>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
}

export default MemberProfileHeader;
