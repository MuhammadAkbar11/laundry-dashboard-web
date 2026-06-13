/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { Card, Col, Container, Row } from 'react-bootstrap';
import FormMemberResendVerification from '@components/Web/Forms/FormMemberResendVerification';

export default function ResendVerificationPage() {
  const TITLE = `Kirim Ulang Verifikasi Email | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Kirim Ulang Verifikasi Email"
        size="sm"
        history={[{ name: 'Kirim Ulang Verifikasi', disabled: true }]}
      />
      <div className="container-fluid bg-white font-opensans py-5">
        <Container>
          <Row>
            <Col sm={10} md={7} lg={5} className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2 text-accent1 text-uppercase fw-bold">
                    Kirim Ulang Verifikasi
                  </h1>
                </div>
                <Card className="shadow-none">
                  <Card.Body className="py-0">
                    <div className="my-sm-4">
                      <FormMemberResendVerification />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

ResendVerificationPage.layout = WebLayout;
