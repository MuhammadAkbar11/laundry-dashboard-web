import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSun,
  faSoap,
  faBurn,
  faTshirt,
} from '@fortawesome/free-solid-svg-icons';

function SectionOurServices() {
  return (
    <div className="container-fluid bg-white  py-5 font-opensans ">
      <Container>
        <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
          Layanan Kami
        </h6>
        <h1 className="display-4 fw-extrabold text-center mb-5 text-accent1 ">
          Apa Yang Kami Tawarkan
        </h1>
        <Row>
          <Col lg={3} md={6} pb={1}>
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center bg-light mb-4 px-4"
              style={{ height: '300px' }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white shadow rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <FontAwesomeIcon
                  icon={faCloudSun}
                  className="fa-3x text-accent2"
                />
              </div>
              <h4 className="fw-bold text-accent1 m-0"> Cuci & Setrika</h4>
            </div>
          </Col>
          <Col lg={3} md={6} pb={1}>
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center bg-light mb-4 px-4"
              style={{ height: '300px' }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white shadow rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <FontAwesomeIcon icon={faSoap} className="fa-3x text-accent2" />
              </div>
              <h4 className="fw-bold text-accent1 m-0">
                Laundry Kiloan / Satuan
              </h4>
            </div>
          </Col>
          <Col lg={3} md={6} pb={1}>
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center bg-light mb-4 px-4"
              style={{ height: '300px' }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white shadow rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <FontAwesomeIcon icon={faBurn} className="fa-3x text-accent2" />
              </div>
              <h4 className="fw-bold text-accent1 m-0">Laundry Gorden</h4>
            </div>
          </Col>
          <Col lg={3} md={6} pb={1}>
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center bg-light mb-4 px-4"
              style={{ height: '300px' }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white shadow rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <FontAwesomeIcon
                  icon={faTshirt}
                  className="fa-3x text-accent2"
                />
              </div>
              <h4 className="fw-bold text-accent1 m-0">Cuci Jas</h4>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SectionOurServices;
