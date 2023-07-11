import {
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
    <Col lg={3} md={6} mb={5}>
      <h4 className="text-white mb-4">Hubungi Kami</h4>
      {/* <p>Dolor clita stet nonumy clita diam vero, et et ipsum diam labore</p> */}
      <p>
        Dapatkan layanan pelanggan terbaik dari kami yang siap membantu Anda
        dengan sepenuh hati.
      </p>
      <p>
        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
        123 Jalan, Jakarta, Indonesia
      </p>
      <p>
        <FontAwesomeIcon icon={faPhoneAlt} className="me-2" />
        +012 345 67890
      </p>
      <p>
        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
        info@example.com
      </p>
    </Col>
  );
}

export default FooterContactInfo;
