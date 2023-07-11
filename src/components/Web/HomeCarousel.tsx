import WebButton from '@components/Buttons/WebButton';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Carousel } from 'react-bootstrap';

type Props = {};

function HomeCarousel({}: Props) {
  return (
    <div className="container-fluid p-0">
      <Carousel id="header-carousel" className="h-100">
        <Carousel.Item className="position-relative">
          <div style={{ height: '100vh' }}>
            <Image
              fill
              style={{ objectFit: 'cover' }}
              className="w-100"
              src="/img/carousel/carousel-1.webp"
              alt="Image"
            />
          </div>
          <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: '900px' }}>
              <h4 className="text-white text-uppercase mb-md-3">
                CUCI & PENYETRIKAAN{' '}
              </h4>
              <h1 className="display-3 text-capitalize text-white fw-bolder mb-md-4">
                Pilihan terbaik untuk Layanan Laundry
              </h1>
              <Link passHref legacyBehavior href="#/">
                <WebButton variant="accent1" className="mt-2">
                  Learn More
                </WebButton>
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="position-relative">
          <div style={{ height: '100vh' }}>
            <Image
              fill
              style={{ objectFit: 'cover' }}
              className="w-100"
              src="/img/carousel/carousel-2.webp"
              alt="Image"
            />
          </div>
          <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: '900px' }}>
              <h4 className="text-white text-uppercase mb-md-3">
                CUCI & PENYETRIKAAN
              </h4>
              <h1 className="display-3 text-capitalize text-white fw-bolder mb-md-4">
                Petugas yang Sangat Profesional
              </h1>
              <Link passHref legacyBehavior href="#/">
                <WebButton variant="accent1" className="mt-2" isLoading>
                  Learn More
                </WebButton>
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HomeCarousel;
