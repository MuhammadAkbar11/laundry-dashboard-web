import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faMapMarkedAlt,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';

import { Container, Row, Col } from 'react-bootstrap';

function HomeContactInfo() {
  return (
    <div className="container-fluid contact-info  mt-5 " style={{ zIndex: 10 }}>
      <Container style={{ padding: '0 30px' }}>
        <Row>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center bg-accent2 mb-4 mb-lg-0"
            style={{ height: '100px' }}
          >
            <div className="d-inline-flex">
              {/* Map Marker icon */}
              <FontAwesomeIcon
                icon={faMapMarkedAlt}
                size="2x"
                className="text-white m-0 me-3"
              />
              <div className="d-flex flex-column">
                <h5 className="text-white fw-bold text-uppercase ">
                  Alamat Kami
                </h5>
                <p className="m-0 text-white">123 Street, New York, USA</p>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center bg-accent1 mb-4 mb-lg-0"
            style={{ height: '100px' }}
          >
            <div className="d-inline-flex text-start  ">
              {/* Envelope icon */}
              <FontAwesomeIcon
                icon={faEnvelope}
                size="2x"
                className="text-white m-0 me-3"
              />
              <div className="d-flex flex-column">
                <h5 className="text-white fw-bold text-uppercase">
                  Email Kami
                </h5>
                <p className="m-0 text-white">tantelaundry71@example.com</p>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center bg-accent2 mb-4 mb-lg-0"
            style={{ height: '100px' }}
          >
            <div className="d-inline-flex text-start">
              {/* Phone Alt icon */}
              <FontAwesomeIcon
                icon={faPhoneAlt}
                size="2x"
                className="text-white m-0 me-3"
              />
              <div className="d-flex flex-column">
                <h5 className="text-white fw-bold text-uppercase">Telpon</h5>
                <p className="m-0 text-white">+012 345 6789</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomeContactInfo;
