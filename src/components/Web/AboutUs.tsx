/* eslint-disable @next/next/no-img-element */
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AboutUs() {
  return (
    <div className="container-fluid bg-white py-5 ">
      <Container className=" pt-lg-5 overflow-hidden ">
        <Row className="align-items-center d-flex align-items-md-stretch font-opensans ">
          <Col lg={5}>
            <div className="position-relative  " style={{ height: '100%' }}>
              <Image
                className="img-fluid "
                src="/img/photos/about.webp"
                alt="about img"
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </Col>
          <Col lg={7} className="mt-5 mt-lg-0 ps-lg-5 my-lg-5 py-lg-5 ">
            <h4 className="text-accent2 font-opensans text-uppercase fw-bold mb-3">
              Tentang Kami
            </h4>
            <h1 className="mb-4 text-capitalize  display-6 font-opensans text-accent1 fw-extrabold ">
              Kami adalah Penyedia Laundry Berkualitas di Kota Anda
            </h1>
            <p
              style={{ fontSize: 20, lineHeight: '1.5rem' }}
              className=" fw-semibold text-accent1 font-opensans fst-italic mb-4"
            >
              Kami memberikan pelayanan terbaik dalam bidang Laundry dan Dry
              Cleaning. Dapatkan pengalaman mencuci yang nyaman dan hasil yang
              memuaskan.
            </p>
            <p className="mb-2 text-grey " style={{ fontSize: 17 }}>
              Komitmen kami adalah memberikan layanan laundry berkualitas dengan
              profesionalisme tinggi. Dengan staf yang terlatih dan menggunakan
              peralatan canggih, kami menjamin kepuasan pelanggan. Percayakan
              cucian Anda kepada kami dan rasakan perbedaannya!
            </p>
            <Row className="font-opensans">
              <Col sm={6} className=" pt-3">
                <div className="d-flex align-items-center">
                  {/* Check icon */}

                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-accent1 m-0 me-2"
                  />
                  <p className="text-accent2 font-opensans fw-semibold text-capitalize  m-0">
                    Layanan Laundry Berkualitas
                  </p>
                </div>
              </Col>
              <Col sm={6} className=" pt-3">
                <div className="d-flex align-items-center">
                  {/* Check icon */}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-accent1 m-0 me-2"
                  />
                  <p className="text-accent2 font-opensans fw-semibold text-capitalize  m-0">
                    Pengiriman Cepat
                  </p>
                </div>
              </Col>
              <div className="col-sm-6 pt-3">
                <div className="d-flex align-items-center">
                  {/* Check icon */}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-accent1 m-0 me-2"
                  />
                  <p className="text-accent2 font-opensans fw-semibold text-capitalize  m-0">
                    Petugas yang Sangat Profesional
                  </p>
                </div>
              </div>
              <div className="col-sm-6 pt-3">
                <div className="d-flex align-items-center">
                  {/* Check icon */}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-accent1 m-0 me-2"
                  />
                  <p className="text-accent2 font-opensans fw-semibold text-capitalize  m-0">
                    Garansi Kepuasan 100%
                  </p>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutUs;
