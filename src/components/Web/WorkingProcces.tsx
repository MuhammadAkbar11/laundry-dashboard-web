import React from 'react';
import clsx from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faTruckLoading,
  faBell,
  faCircleCheck,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '@hooks/useMediaQuery';

type Step = {
  icon: IconDefinition;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    icon: faBoxOpen,
    title: 'Buat Pesanan',
    description: 'Pilih layanan dan buat pesanan laundry Anda secara online.',
  },
  {
    icon: faTruckLoading,
    title: 'Cucian Diproses',
    description: 'Cucian dijemput gratis lalu diproses oleh petugas kami.',
  },
  {
    icon: faBell,
    title: 'Status Diperbarui',
    description: 'Pantau perkembangan cucian Anda secara real-time.',
  },
  {
    icon: faCircleCheck,
    title: 'Selesai',
    description: 'Cucian bersih dan rapi diantar kembali ke alamat Anda.',
  },
];

function WorkingProcces() {
  const smMax = useMediaQuery('sm-max');
  const smMin = useMediaQuery('sm-min');

  return (
    <div
      style={{ paddingBottom: 100, paddingTop: 120 }}
      className="container-fluid bg-light font-opensans"
    >
      <Container>
        <h6 className="text-accent2 text-uppercase text-center fw-semibold mb-3">
          Proses Kerja
        </h6>
        <h1
          className={clsx('text-center mb-3 fw-extrabold text-accent1', {
            'display-4': smMin,
            'display-6': smMax,
          })}
        >
          Bagaimana Kami Bekerja
        </h1>
        <p
          className="text-center text-grey mb-5 mx-auto"
          style={{ maxWidth: 640, fontSize: 17 }}
        >
          Hanya empat langkah mudah dari pemesanan hingga cucian kembali bersih.
        </p>
        <Row>
          {STEPS.map((step, index) => (
            <Col key={step.title} lg={3} md={6}>
              <div className="step-card d-flex flex-column align-items-center justify-content-start text-center mb-5">
                <div className="position-relative">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg rounded-circle mb-4 p-2"
                    style={{ width: '150px', height: '150px' }}
                  >
                    <FontAwesomeIcon
                      icon={step.icon}
                      className="display-3 text-accent2 m-0"
                    />
                  </div>
                  <span className="step-number">{index + 1}</span>
                </div>
                <h3 className="fw-extrabold text-accent1 m-0 mt-2 mb-2">
                  {step.title}
                </h3>
                <p
                  className="text-grey m-0 px-2"
                  style={{ maxWidth: 240, fontSize: 15 }}
                >
                  {step.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default WorkingProcces;
