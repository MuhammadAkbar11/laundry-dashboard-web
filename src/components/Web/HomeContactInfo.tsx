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
    <div className="container-fluid contact-info mt-5 " style={{ zIndex: 10 }}>
      <Container className="">
        <Row>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center bg-accent2 mb-4 mb-md-0 px-5"
            style={{ height: '100px' }}
          >
            <div className="d-flex justify-content-md-center text-start w-100">
              {/* Map Marker icon */}
              <FontAwesomeIcon
                icon={faMapMarkedAlt}
                size="2x"
                className="text-white m-0 me-3"
              />
              <div className="d-flex flex-column">
                <h5 className="text-white mb-1 fw-bold text-uppercase ">
                  Alamat Kami
                </h5>
                <p className="m-0 text-white opacity-75">
                  Jatimakmur, Pondok Gede
                </p>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center bg-accent1 mb-4 mb-md-0 px-5"
            style={{ height: '100px' }}
          >
            <div className="d-flex justify-content-md-center text-start w-100">
              {/* Envelope icon */}
              <FontAwesomeIcon
                icon={faEnvelope}
                size="2x"
                className="text-white m-0 me-3"
              />
              <div className="d-flex flex-column ">
                <h5 className="text-white mb-1 fw-bold text-uppercase">
                  Email Kami
                </h5>
                <p className="m-0 text-white opacity-75 text-wrap">
                  tantelaundry71@gmail.com
                </p>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center bg-accent2 mb-4 mb-md-0 px-5"
            style={{ height: '100px' }}
          >
            <div className="d-flex justify-content-md-center text-start w-100">
              {/* Phone Alt icon */}
              <FontAwesomeIcon
                icon={faPhoneAlt}
                size="2x"
                className="text-white m-0 me-3"
              />
              <div className="d-flex flex-column">
                <h5 className="text-white mb-1 fw-bold text-uppercase">
                  Telpon
                </h5>
                <p className="m-0 text-white opacity-75">+62852 3456 6789</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomeContactInfo;
