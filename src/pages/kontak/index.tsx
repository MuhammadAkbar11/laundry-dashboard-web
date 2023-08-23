import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faEnvelopeOpen,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import WebLayout from '@layouts/WebLayout';
import Head from 'next/head';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import WebButton from '@components/Buttons/WebButton';
import useNotification from '@hooks/useNotification';

function ContactPage() {
  const TITLE = `Kontak Kami | ${APP_NAME}`;

  const notif = useNotification();

  const handleSubmitSendMsg = () => {
    notif.info('Fitur sedang dalam pengembangan');
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Tentang Kami"
        size="sm"
        history={[{ name: 'Tentang Kami', disabled: true }]}
      />
      <div className="container-fluid bold font-opensans py-5 bg-white ">
        <Container className="pb-5 px-md-2 px-md-3">
          <Row>
            <Col md={12}>
              <Row>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                      style={{
                        width: '100px',
                        height: '100px',
                        borderWidth: '15px !important',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-accent2 fa-2x"
                      />
                    </div>
                    <h3 className=" fw-bold font-opensans  text-accent1 m-0 mt-2">
                      Jatimakmur, Pondok Gede
                    </h3>{' '}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                      style={{
                        width: '100px',
                        height: '100px',
                        borderWidth: '15px !important',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEnvelopeOpen}
                        className="text-accent2 fa-2x"
                      />
                    </div>
                    <h3 className=" fw-bold font-opensans  text-accent1 m-0 mt-2">
                      tantelaundry71@gmail.com{' '}
                    </h3>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center justify-content-center text-center mb-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-white border border-light shadow-lg  rounded-circle mb-4 p-2 "
                      style={{
                        width: '100px',
                        height: '100px',
                        borderWidth: '15px !important',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPhoneAlt}
                        className="text-accent2 fa-2x"
                      />
                    </div>
                    <h3 className=" fw-bold font-opensans  text-accent1 m-0 mt-2">
                      {' '}
                      +62852 3456 6789
                    </h3>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <div className="contact-form">
                {/* <div id="success" /> */}
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitSendMsg();
                  }}
                  id="contactForm"
                  noValidate
                >
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Control
                          type="text"
                          size="lg"
                          placeholder="Nama Anda"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your name
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Control
                          type="email"
                          size="lg"
                          placeholder="Email Anda"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your email
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="subject">
                    <Form.Control type="text" placeholder="Subject" required />
                    <Form.Control.Feedback type="invalid">
                      Please enter a subject
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="message">
                    <Form.Control
                      as="textarea"
                      rows={6}
                      size="lg"
                      placeholder="Pesan"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your message
                    </Form.Control.Feedback>
                  </Form.Group>
                  <WebButton
                    variant="primary"
                    type="submit"
                    id="sendMessageButton"
                  >
                    Kirim Pesan
                  </WebButton>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

ContactPage.layout = WebLayout;

export default ContactPage;
