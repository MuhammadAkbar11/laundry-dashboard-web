import React from 'react';
import Link from 'next/link';
import { Col } from 'react-bootstrap';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {};

function FooterQuickLinks({}: Props) {
  return (
    <Col lg={3} md={6} mb={5} className="ps-lg-4 mb-3">
      <h4 className="text-white mb-4">Links</h4>
      <div className="d-flex flex-column justify-content-center ">
        <Link className="text-white mb-2" href="/">
          <FontAwesomeIcon icon={faAngleRight} className="me-2" />
          Beranda
        </Link>
        <Link className="text-white mb-2" href="/tentang">
          <FontAwesomeIcon icon={faAngleRight} className="me-2" />
          Tentang Kami
        </Link>
        <Link className="text-white mb-2" href="/layanan">
          <FontAwesomeIcon icon={faAngleRight} className="me-2" />
          Layanan
        </Link>
        <Link className="text-white mb-2" href="/price">
          <FontAwesomeIcon icon={faAngleRight} className="me-2" />
          Harga
        </Link>
      </div>
    </Col>
  );
}

export default FooterQuickLinks;
