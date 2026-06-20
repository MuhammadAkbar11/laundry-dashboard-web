import React from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import { Container } from 'react-bootstrap';
import WebButton from '@components/Buttons/WebButton';
import useMediaQuery from '@hooks/useMediaQuery';

function FinalCTA() {
  const sm = useMediaQuery('sm-max');

  return (
    <div className="container-fluid final-cta py-5 font-opensans">
      <Container className="py-lg-4 text-center">
        <h1
          className={clsx('fw-extrabold text-white mb-3', {
            'display-6': sm,
            'display-4': !sm,
          })}
        >
          Siap Memulai?
        </h1>
        <p
          className="text-white opacity-90 mb-4 mx-auto"
          style={{ maxWidth: 600, fontSize: 18 }}
        >
          Pesan laundry Anda sekarang dan rasakan kemudahan mengelola cucian
          bersama CusCuciin.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
          <Link passHref legacyBehavior href="/m/pemesanan">
            <WebButton variant="accent2">Pesan Sekarang</WebButton>
          </Link>
          <Link passHref legacyBehavior href="/daftar">
            <WebButton variant="outline-light">Daftar Member</WebButton>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default FinalCTA;
