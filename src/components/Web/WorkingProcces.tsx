import React from 'react';
import clsx from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faTruckLoading,
  faTshirt,
  faShippingFast,
} from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '@hooks/useMediaQuery';

function WorkingProcces() {
  const smMax = useMediaQuery('sm-max');
  const smMin = useMediaQuery('sm-min');

  return (
    <div
      style={{ paddingBottom: 100, paddingTop: 120 }}
      className="container-fluid bg-white font-opensans  "
    >
      <Container>
        <h6 className="text-accent2 text-uppercase text-center text-accent2 fw-semibold mb-3">
          Proses Kerja
        </h6>
        <h1
          className={clsx('text-center mb-5 fw-extrabold text-accent1 ', {
            'display-4': smMin,
            'display-6': smMax,
          })}
        >
          Bagaimana Kami Bekerja
        </h1>
        <Row>
          <Col lg={3} md={6}>
            <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                style={{
                  width: '150px',
                  height: '150px',
                  borderWidth: '15px !important',
                }}
              >
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="display-3 text-accent2 m-0"
                />
              </div>
              <h3 className="fw-extrabold text-accent1  m-0 mt-2">Memesan</h3>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                style={{
                  width: '150px',
                  height: '150px',
                  borderWidth: '15px !important',
                }}
              >
                <FontAwesomeIcon
                  icon={faTruckLoading}
                  className="display-3 text-accent2 m-0"
                />
              </div>
              <h3 className="fw-extrabold text-accent1  m-0 mt-2">
                Penjemputan Gratis
              </h3>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                style={{
                  width: '150px',
                  height: '150px',
                  borderWidth: '15px !important',
                }}
              >
                <FontAwesomeIcon
                  icon={faTshirt}
                  className="display-3 text-accent2 m-0"
                />
              </div>
              <h3 className="fw-extrabold text-accent1  m-0 mt-2">
                Dry Cleaning
              </h3>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                style={{
                  width: '150px',
                  height: '150px',
                  borderWidth: '15px !important',
                }}
              >
                <FontAwesomeIcon
                  icon={faShippingFast}
                  className="display-3 text-accent2 m-0"
                />
              </div>
              <h3 className="fw-extrabold text-accent1  m-0 mt-2">
                Pengiriman Gratis
              </h3>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default WorkingProcces;
