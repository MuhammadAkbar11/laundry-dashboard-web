/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { Card, Col, Container, Row } from 'react-bootstrap';
import FormMemberResetPassword from '@components/Web/Forms/FormMemberResetPassword';

/**
 * Issue 015-B — `/reset-password` page.
 *
 * Reads the `?token=...` query string via the form's own router
 * integration (see `FormMemberResetPassword`). The page itself is
 * stateless — it just hosts the form so the reset link from the
 * email can deep-link into the right view.
 *
 * The form handles:
 *   - missing token  → "Invalid Token" state
 *   - expired token  → surfaced by the backend error
 *   - already used   → surfaced by the backend error
 *   - generic error  → surfaced by the backend error
 */
export default function ResetPasswordPage() {
  const TITLE = `Reset Kata Sandi | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Reset Kata Sandi"
        size="sm"
        history={[{ name: 'Reset Kata Sandi', disabled: true }]}
      />
      <div className="container-fluid bg-white font-opensans py-5">
        <Container>
          <Row>
            <Col sm={10} md={7} lg={5} className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2 text-accent1 text-uppercase fw-bold">
                    Reset Kata Sandi
                  </h1>
                </div>
                <Card className="shadow-none">
                  <Card.Body className="py-0">
                    <div className="my-sm-4">
                      <FormMemberResetPassword />
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

ResetPasswordPage.layout = WebLayout;