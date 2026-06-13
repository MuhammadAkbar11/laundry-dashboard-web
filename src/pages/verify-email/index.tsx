/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { Card, Col, Container, Row } from 'react-bootstrap';
import FormMemberVerifyEmail from '@components/Web/Forms/FormMemberVerifyEmail';

export default function VerifyEmailPage() {
  const TITLE = `Verifikasi Email | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Verifikasi Email"
        size="sm"
        history={[{ name: 'Verifikasi Email', disabled: true }]}
      />
      <div className="container-fluid bg-white font-opensans py-5">
        <Container>
          <Row>
            <Col sm={10} md={7} lg={5} className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2 text-accent1 text-uppercase fw-bold">
                    Verifikasi Email
                  </h1>
                </div>
                <Card className="shadow-none">
                  <Card.Body className="py-0">
                    <div className="my-sm-4">
                      <FormMemberVerifyEmail />
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

VerifyEmailPage.layout = WebLayout;
