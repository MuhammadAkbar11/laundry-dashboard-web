import {
  faClock,
  faEnvelope,
  faMapMarkerAlt,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col } from 'react-bootstrap';

type Props = {};

function FooterContactInfo({}: Props) {
  return (
    <Col lg={3} md={6} mb={5} className="mb-3">
      <h4 className="text-white mb-4">Hubungi Kami</h4>
      <p>
        Layanan pelanggan kami siap membantu Anda dengan sepenuh hati setiap
        hari.
      </p>
      <p className="mb-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
        Jatimakmur, Indonesia
      </p>
      <p className="mb-2">
        <FontAwesomeIcon icon={faPhoneAlt} className="me-2" />
        +62852 3456 6789
      </p>
      <p className="mb-2">
        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
        customercuciin@gmail.com
      </p>
      <p className="mb-0">
        <FontAwesomeIcon icon={faClock} className="me-2" />
        Setiap hari, 08.00 - 21.00 WIB
      </p>
    </Col>
  );
}

export default FooterContactInfo;
