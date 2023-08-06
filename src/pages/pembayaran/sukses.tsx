/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebMiscLayout from '@layouts/WebMiscLayout';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import WebButton from '@components/Buttons/WebButton';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';

export default function PaymentSuccesPage() {
  const TITLE = `Pembayaran Berhasil | ${APP_NAME}`;

  const router = useRouter();
  const laundryQueue = router?.query?.laundryQueue;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <div className="container-fluid bg-white font-opensans py-5">
        <Container className="pb-5 px-md-2 px-md-3 d-flex flex-column justify-content-center h-100 ">
          <Row className="justify-content-center ">
            <Col xs={12} md={6}>
              <div className="text-center mt-1 font-opensans ">
                <h1 className="mb-5 text-dark fw-bolder  ">
                  Pembayaran Sudah di Terima
                </h1>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="7x"
                  className="text-success"
                />
                <h3 className="mt-4 fw-bold text-capitalize ">
                  Terima kasih telah menggunakan jasa kami
                </h3>
                {laundryQueue ? (
                  <h5 className="mt-3">No Antrian Anda: {laundryQueue}</h5>
                ) : null}
                <p className="">
                  Saat ini pembayaran Anda telah masuk dan sedang diproses.
                  Mohon tunggu konfirmasi lebih lanjut.
                </p>
              </div>
            </Col>
            <Col xs={12} className="mt-4">
              <div className="button-group d-flex justify-content-center align-items-center gap-3 mx-auto">
                <div>
                  <Link href="/m/dashboard" legacyBehavior passHref>
                    <WebButton
                      variant="success"
                      className=" fw-medium text-lg rounded-pill mb-16"
                    >
                      Dashboard
                    </WebButton>
                  </Link>
                </div>
                <div>
                  <WebButton
                    className=" fw-medium text-lg rounded-pill"
                    role="button"
                    variant="outline-success"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="me-1" />{' '}
                    WhatsApp ke Admin
                  </WebButton>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

PaymentSuccesPage.layout = WebMiscLayout;
