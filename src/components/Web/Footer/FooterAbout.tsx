import Link from 'next/link';
import React from 'react';
import { Col } from 'react-bootstrap';
import Logo from '@components/Logo/Logo';

type Props = {};

function FooterAbout({}: Props) {
  return (
    <Col lg={3} md={6} mb={5} className="mb-3">
      <Link href="/">
        {/* <h1 className="text-accent2 fw-bolder mb-3">
          <span className="text-white">TANTE LAU</span>NDRY 71
        </h1> */}
        <div className="pb-3 d-flex justify-content-center ">
          <Logo variant="light" height={60} width={60 * 3} />
        </div>
      </Link>
      <p style={{ fontSize: '1.05rem' }} className="text-justify">
        Kami adalah solusi terbaik untuk kebutuhan layanan laundry Anda.
        Dapatkan pengalaman laundry yang nyaman dan berkualitas dengan kami.
      </p>
    </Col>
  );
}

export default FooterAbout;
