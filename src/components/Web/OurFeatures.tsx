import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faBolt,
  faClockRotateLeft,
  faMobileScreenButton,
  faTags,
  faTruck,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

type Feature = {
  icon: IconDefinition;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: faMobileScreenButton,
    title: 'Status Laundry Real-Time',
    description:
      'Pantau setiap tahap proses cucian Anda langsung dari aplikasi.',
  },
  {
    icon: faClockRotateLeft,
    title: 'Riwayat Pesanan',
    description:
      'Akses seluruh riwayat pesanan dan transaksi Anda kapan saja.',
  },
  {
    icon: faBell,
    title: 'Notifikasi Otomatis',
    description:
      'Dapatkan pemberitahuan setiap kali status pesanan diperbarui.',
  },
  {
    icon: faTags,
    title: 'Harga Transparan',
    description: 'Harga jelas tanpa biaya tersembunyi sebelum Anda memesan.',
  },
  {
    icon: faBolt,
    title: 'Layanan Cepat',
    description: 'Proses pengerjaan yang cepat dengan kualitas tetap terjaga.',
  },
];

function OurFeatures() {
  return (
    <div
      className="container-fluid bg-white font-opensans"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <Container>
        <Row>
          <Col lg={7} className="my-lg-5 pt-0 pt-lg-5 pe-lg-5">
            <h6 className="text-accent2 text-uppercase fw-semibold mb-3 text-center text-sm-start">
              Mengapa Memilih Kami
            </h6>
            <h1 className="mb-4 fw-extrabold text-accent1 display-6 text-center text-sm-start">
              Lebih Dari Sekadar Laundry
            </h1>
            <p
              style={{ fontSize: 17 }}
              className="text-grey text-center text-sm-start mb-4"
            >
              CusCuciin menggabungkan layanan laundry berkualitas dengan
              kemudahan teknologi, sehingga Anda dapat memesan dan memantau
              cucian tanpa repot.
            </p>
            <Row className="py-2">
              {FEATURES.map((feature) => (
                <Col
                  key={feature.title}
                  sm={6}
                  className="mb-4 text-center text-sm-start"
                >
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="fa-3x text-accent2 mb-3"
                  />
                  <h5 className="fw-bold text-accent1">{feature.title}</h5>
                  <p className="text-muted m-0">{feature.description}</p>
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={5} className="mt-4 mt-lg-0">
            <div className="d-flex flex-column text-uppercase align-items-center justify-content-center bg-accent2 h-100 py-5 px-3 rounded-3">
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
