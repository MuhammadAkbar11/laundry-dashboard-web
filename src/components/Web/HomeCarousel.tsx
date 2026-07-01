import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTruck, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import WebButton from '@components/Buttons/WebButton';
import useMediaQuery from '@hooks/useMediaQuery';

type Props = {};

type Stat = {
  icon: typeof faStar;
  value: string;
  label: string;
};

const STATS: Stat[] = [
  { icon: faBoxOpen, value: '1000+', label: 'Pesanan Selesai' },
  { icon: faStar, value: '4.9', label: 'Rating Pelanggan' },
  { icon: faTruck, value: 'Gratis', label: 'Jemput & Antar' },
];

function HomeCarousel({}: Props) {
  const sm = useMediaQuery('sm-max');
  const xs = useMediaQuery('xs');
  const isMobile = sm || xs;

  return (
    <div className="container-fluid hero-split font-opensans">
      <Container className="py-5">
        <Row className="align-items-center g-5 py-lg-4">
          <Col lg={6} className="text-center text-lg-start">
            <h6 className="text-uppercase fw-semibold text-accent2 mb-3">
              Cuci & Penyetrikaan
            </h6>
            <h1
              className={clsx(
                'text-capitalize text-accent1 fw-bolder mb-3',
                isMobile ? 'display-5' : 'display-3'
              )}
            >
              Laundry Lebih Mudah Dengan CusCuciin
            </h1>
            <p
              className="text-grey mb-4 mx-auto mx-lg-0"
              style={{ fontSize: isMobile ? 16 : 20, maxWidth: '560px' }}
            >
              Pesan laundry, pantau status cucian, dan kelola pesanan Anda
              dengan mudah dalam satu aplikasi.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <Link passHref legacyBehavior href="/m/pemesanan">
                <WebButton variant="accent1">Pesan Sekarang</WebButton>
              </Link>
              <Link passHref legacyBehavior href="/daftar">
                <WebButton variant="outline-accent1">Daftar Member</WebButton>
              </Link>
            </div>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 mt-5">
              {STATS.map((stat) => (
                <div key={stat.label} className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={stat.icon}
                    className="fa-2x text-accent2 me-3"
                  />
                  <div className="text-start">
                    <h4 className="fw-extrabold text-accent1 m-0 lh-1">
                      {stat.value}
                    </h4>
                    <small className="text-grey">{stat.label}</small>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-image position-relative">
              <Image
                src="/img/carousel/carousel-1.webp"
                alt="Layanan laundry CusCuciin"
                width={720}
                height={560}
                priority
                className="img-fluid w-100 rounded-4 shadow-lg"
                style={{ objectFit: 'cover', height: isMobile ? 320 : 480 }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomeCarousel;
