/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { Card, Col, Container, Row } from 'react-bootstrap';
import FormMemberForgotPassword from '@components/Web/Forms/FormMemberForgotPassword';

/**
 * Issue 015-B — `/forgot-password` page.
 *
 * Renders the forgot-password form inside the same web layout chrome
 * used by the login page. No getServerSideProps is required: this
 * page is publicly accessible and does not depend on any session.
 */
export default function ForgotPasswordPage() {
  const TITLE = `Lupa Kata Sandi | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Lupa Kata Sandi"
        size="sm"
        history={[{ name: 'Lupa Kata Sandi', disabled: true }]}
      />
      <div className="container-fluid bg-white font-opensans py-5">
        <Container>
          <Row>
            <Col sm={10} md={7} lg={5} className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2 text-accent1 text-uppercase fw-bold">
                    Lupa Kata Sandi
                  </h1>
                </div>
                <Card className="shadow-none">
                  <Card.Body className="py-0">
                    <div className="my-sm-4">
                      <FormMemberForgotPassword />
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

ForgotPasswordPage.layout = WebLayout;