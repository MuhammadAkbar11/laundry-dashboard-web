import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import clsx from 'classnames';
import Link from 'next/link';
import AppIcon from '@components/Icons/AppIcon';
import WebButton from '@components/Buttons/WebButton';
import useNotification from '@hooks/useNotification';
import useMediaQuery from '@hooks/useMediaQuery';
import {
  contactInfo,
  contactActions,
  mapEmbedUrl,
  ContactInfoItem,
} from '@utils/dummyData/contacts';
import { businessHours } from '@utils/dummyData/support';

function renderInfoValue(item: ContactInfoItem) {
  if (!item.href) {
    return <span className="text-accent1">{item.value}</span>;
  }
  return (
    <a
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      className="text-accent1 text-decoration-none"
    >
      {item.value}
    </a>
  );
}

function ContactContent() {
  const sm = useMediaQuery('sm-max');
  const notif = useNotification();

  const handleSubmitSendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    notif.info('Fitur sedang dalam pengembangan');
  };

  return (
    <div className="container-fluid bg-white font-opensans py-5">
      <Container className="pb-5 px-md-2 px-md-3">
        <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
          Hubungi Kami
        </h6>
        <h2
          className={clsx('fw-extrabold text-center mb-3 text-accent1', {
            'display-6': sm,
            'display-5': !sm,
          })}
        >
          Mari Terhubung dengan CusCuciin
        </h2>
        <p
          className="text-center text-grey mb-5 mx-auto"
          style={{ maxWidth: 640, fontSize: 17 }}
        >
          Punya pertanyaan atau membutuhkan bantuan? Tim kami siap membantu Anda
          kapan saja.
        </p>

        {/* Contact info cards */}
        <Row className="g-4 mb-5">
          {contactInfo.map((item) => (
            <Col key={item.id} lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm rounded-3 text-center">
                <Card.Body className="p-4 d-flex flex-column align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-accent2 rounded-circle mb-3"
                    style={{ width: 64, height: 64 }}
                  >
                    <AppIcon
                      name={item.icon}
                      size={28}
                      className="text-white"
                    />
                  </div>
                  <p className="text-muted small fw-semibold mb-1">
                    {item.label}
                  </p>
                  <Card.Title as="h3" className="h6 fw-bold mb-0">
                    {renderInfoValue(item)}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA buttons */}
        <div className="text-center mb-5">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {contactActions.map((action) => (
              <WebButton
                key={action.id}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                variant={action.variant}
                size="lg"
              >
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name={action.icon} size={18} />
                  {action.label}
                </span>
              </WebButton>
            ))}
          </div>
        </div>

        {/* Business hours + Map */}
        <Row className="g-4 mb-5">
          <Col lg={5}>
            <Card className="h-100 border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <AppIcon name="Clock" size={24} className="text-accent2" />
                  <h3 className="h5 fw-bold text-accent1 mb-0">
                    Jam Operasional
                  </h3>
                </div>
                <Row className="g-3">
                  <Col xs={12}>
                    <p className="text-muted mb-0 small fw-semibold">
                      Hari Operasional
                    </p>
                    <p className="text-dark mb-0">{businessHours.days}</p>
                  </Col>
                  <Col xs={12}>
                    <p className="text-muted mb-0 small fw-semibold">
                      Jam Buka
                    </p>
                    <p className="text-dark mb-0">{businessHours.hours}</p>
                  </Col>
                  <Col xs={12}>
                    <p className="text-muted mb-0 small fw-semibold">
                      Estimasi Respons
                    </p>
                    <p className="text-dark mb-0">
                      {businessHours.responseTime}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7}>
            <div className="ratio ratio-4x3 rounded-3 overflow-hidden shadow-sm">
              <iframe
                src={mapEmbedUrl}
                title="Lokasi CusCuciin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ border: 0 }}
              />
            </div>
          </Col>
        </Row>

        {/* Contact form */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="p-4 p-md-5">
                <h2 className="h4 fw-bold text-accent1 mb-1">Kirim Pesan</h2>
                <p className="text-grey mb-4">
                  Isi formulir di bawah ini dan tim kami akan menghubungi Anda.
                </p>
                <Form
                  onSubmit={handleSubmitSendMsg}
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
                          Masukkan nama Anda
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
                          Masukkan email Anda
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="subject">
                    <Form.Control
                      type="text"
                      size="lg"
                      placeholder="Subjek"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Masukkan subjek
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
                      Masukkan pesan Anda
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
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Cross navigation */}
        <div className="text-center mt-5 pt-3 border-top">
          <p className="text-muted mb-3">
            Jelajahi sumber daya bantuan lainnya:
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link href="/faq" passHref legacyBehavior>
              <WebButton variant="accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="HelpCircle" size={18} />
                  FAQ
                </span>
              </WebButton>
            </Link>
            <Link href="/help" passHref legacyBehavior>
              <WebButton variant="outline-accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="BookOpen" size={18} />
                  Panduan
                </span>
              </WebButton>
            </Link>
            <Link href="/support" passHref legacyBehavior>
              <WebButton variant="outline-accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="LifeBuoy" size={18} />
                  Support
                </span>
              </WebButton>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactContent;
