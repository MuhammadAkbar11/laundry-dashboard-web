import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faHandHoldingUsd,
  faHandshake,
  faHeart,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';

function OurFeatures() {
  return (
    <div
      className="container-fluid  bg-light font-opensans"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <Container>
        <Row>
          <Col lg={7} m={0} className="my-lg-5 pt-0 pt-lg-5 pe-lg-5 ">
            <h6 className="text-accent2 text-uppercase fw-semibold mb-3  text-center text-sm-start">
              Fitur Kami
            </h6>
            <h1 className="mb-4 fw-extrabold text-accent1 display-6   text-center text-sm-start">
              Mengapa Memilih Kami
            </h1>
            <p style={{ fontSize: 17 }} className=" text-center text-sm-start">
              Kami adalah pilihan yang tepat untuk layanan cucian Anda. Dengan
              pengalaman yang kami miliki, kami telah menjadi mitra terpercaya
              dalam menyediakan layanan cucian berkualitas. Tim ahli kami siap
              memberikan solusi terbaik untuk kebutuhan cucian Anda.
            </p>
            <div className="row py-2">
              <div className="col-sm-6 mb-4 text-center text-sm-start ">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="fa-3x text-accent2 mb-3"
                />
                <h5 className="fw-bold text-accent1 ">Pelayanan Profesional</h5>
                <p className="text-muted">
                  Kami memberikan pelayanan profesional yang berkualitas tinggi
                  untuk memenuhi kebutuhan Anda.
                </p>
              </div>
              <div className="col-sm-6 mb-4 text-center text-sm-start ">
                {/* <FontAwesomeIcon
                  icon={faLiraSign}
                  className="fa-3x text-accent2 mb-3"
                />
                <h5 className="fw-bold text-accent1 ">Terjangkau</h5>
                <p className="text-muted">
                 Kami menjamin pengiriman cepat dan tepat waktu untuk menjaga
                  kenyamanan Anda.
                  Tanpa Biaya Tambahan! Anda hanya membayar sesuai dengan harga
                  yang ditetapkan oleh kami.
                </p> */}
                <FontAwesomeIcon
                  icon={faHandHoldingUsd}
                  className="fa-3x text-accent2 mb-3"
                />
                <h5 className="fw-bold text-accent1">Layanan Terjangkau</h5>
                <p className="text-muted">
                  Kami menyediakan layanan dengan harga terjangkau tanpa
                  mengorbankan kualitas.
                </p>
              </div>
              <div className="col-sm-6 mb-4 text-center text-sm-start ">
                <FontAwesomeIcon
                  icon={faHandshake}
                  className="fa-3x text-accent2 mb-3"
                />
                <h5 className="fw-bold text-accent1 ">
                  Komitmen Terhadap Kualitas
                </h5>
                <p className="text-muted">
                  Kami berkomitmen untuk memberikan kualitas terbaik dalam
                  setiap layanan kami.
                </p>
              </div>
              <div className="col-sm-6 mb-4 text-center text-sm-start text-md-start ">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="fa-3x text-accent2 mb-3"
                />
                <h5 className="fw-bold text-accent1 ">Kepuasan Pelanggan</h5>
                <p className="text-muted">
                  Kepuasan pelanggan adalah prioritas utama kami. Kami senang
                  dapat memberikan layanan yang memuaskan.
                </p>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="d-flex flex-column text-uppercase  align-items-center justify-content-center bg-accent2 h-100 py-5 px-3">
              <FontAwesomeIcon
                icon={faTruck}
                className="fa-5x text-white mb-5"
              />
              <h1 className="display-4 fw-bolder text-white mb-3">Gratis</h1>
              <h1 className="text-white m-0 text-center">
                Penjemputan & Pengiriman
              </h1>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OurFeatures;
