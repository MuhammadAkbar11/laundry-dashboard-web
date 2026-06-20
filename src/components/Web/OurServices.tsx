import React from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSun,
  faSoap,
  faBurn,
  faTshirt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '@hooks/useMediaQuery';

type Service = {
  icon: IconDefinition;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: faCloudSun,
    title: 'Cuci & Setrika',
    description:
      'Pakaian dicuci bersih, dikeringkan, dan disetrika rapi siap pakai.',
  },
  {
    icon: faSoap,
    title: 'Laundry Kiloan / Satuan',
    description:
      'Fleksibel sesuai kebutuhan, dihitung per kilogram atau per potong.',
  },
  {
    icon: faBurn,
    title: 'Laundry Gorden',
    description:
      'Penanganan khusus untuk gorden agar kembali bersih dan wangi.',
  },
  {
    icon: faTshirt,
    title: 'Cuci Jas',
    description:
      'Perawatan premium untuk jas dan pakaian formal kesayangan Anda.',
  },
];

function SectionOurServices() {
  const sm = useMediaQuery('sm-max');
  const md = useMediaQuery('md-min');

  return (
    <div className="container-fluid bg-white py-5 font-opensans">
      <Container>
        <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
          Layanan Kami
        </h6>
        <h1
          className={clsx('fw-extrabold text-center mb-3 text-accent1', {
            'display-6': sm,
            'display-4': md,
          })}
        >
          Apa Yang Kami Tawarkan
        </h1>
        <p
          className="text-center text-grey mb-5 mx-auto"
          style={{ maxWidth: 640, fontSize: 17 }}
        >
          Beragam pilihan layanan laundry untuk memenuhi semua kebutuhan cucian
          Anda.
        </p>
        <Row className="g-4">
          {SERVICES.map((service) => (
            <Col key={service.title} lg={3} md={6}>
              <div
                className="d-flex flex-column align-items-center justify-content-center text-center bg-light rounded-3 h-100 p-4 service-card"
                style={{ minHeight: '280px' }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle mb-4"
                  style={{ width: '100px', height: '100px' }}
                >
                  <FontAwesomeIcon
                    icon={service.icon}
                    className="fa-3x text-accent2"
                  />
                </div>
                <h4 className="fw-bold text-accent1 mb-2">{service.title}</h4>
                <p className="text-grey m-0" style={{ fontSize: 15 }}>
                  {service.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Link className="fw-bold text-accent2 text-uppercase" href="/layanan">
            Lihat Semua Layanan &rarr;
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default SectionOurServices;
