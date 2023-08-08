import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { Col } from 'react-bootstrap';

type Props = {};

function FooterAbout({}: Props) {
  return (
    <Col lg={3} md={6} mb={5}>
      <Link href="/">
        <h1 className="text-accent2 fw-bolder mb-3">
          <span className="text-white">TANTE LAU</span>NDRY 71
        </h1>
      </Link>
      <p style={{ fontSize: '1.05rem' }}>
        Kami adalah solusi terbaik untuk kebutuhan layanan laundry Anda.
        Dapatkan pengalaman laundry yang nyaman dan berkualitas dengan kami.
      </p>
      <div className="d-flex justify-content-start mt-4">
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 px-0 d-flex align-items-center justify-content-center "
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 d-flex align-items-center justify-content-center  px-0"
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 px-0 d-flex align-items-center justify-content-center "
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 px-0 d-flex align-items-center justify-content-center "
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
    </Col>
  );
}

export default FooterAbout;
