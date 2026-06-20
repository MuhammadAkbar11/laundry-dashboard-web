import React from 'react';
import clsx from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '@hooks/useMediaQuery';

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rina Wijaya',
    role: 'Pelanggan',
    quote:
      'Pesannya gampang banget lewat aplikasi dan bisa pantau status cucian. Hasilnya bersih dan wangi!',
  },
  {
    name: 'Budi Santoso',
    role: 'Pelanggan',
    quote:
      'Penjemputan dan pengiriman gratis sangat membantu. Tidak perlu keluar rumah, cucian beres.',
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Pelanggan',
    quote:
      'Harga transparan dan notifikasinya jelas. Saya selalu tahu kapan cucian saya selesai.',
  },
];

function Testimonials() {
  const sm = useMediaQuery('sm-max');
  const md = useMediaQuery('md-min');

  return (
    <div className="container-fluid bg-light py-5 font-opensans">
      <Container className="py-lg-4">
        <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
          Testimoni
        </h6>
        <h1
          className={clsx('fw-extrabold text-center mb-3 text-accent1', {
            'display-6': sm,
            'display-4': md,
          })}
        >
          Apa Kata Pelanggan Kami
        </h1>
        <p
          className="text-center text-grey mb-5 mx-auto"
          style={{ maxWidth: 640, fontSize: 17 }}
        >
          Kepuasan pelanggan adalah prioritas utama kami.
        </p>
        <Row className="g-4">
          {TESTIMONIALS.map((item) => (
            <Col key={item.name} lg={4} md={6}>
              <div className="testimonial-card bg-white rounded-3 shadow-sm p-4 d-flex flex-column">
                <FontAwesomeIcon
                  icon={faQuoteLeft}
                  className="fa-2x text-accent2 mb-3 opacity-50"
                />
                <p className="text-grey flex-grow-1" style={{ fontSize: 16 }}>
                  {item.quote}
                </p>
                <div className="mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="text-warning me-1"
                    />
                  ))}
                </div>
                <div>
                  <h6 className="fw-bold text-accent1 m-0">{item.name}</h6>
                  <small className="text-muted">{item.role}</small>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Testimonials;
