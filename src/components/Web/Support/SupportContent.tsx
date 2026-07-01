import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import clsx from 'classnames';
import Link from 'next/link';
import AppIcon from '@components/Icons/AppIcon';
import {
  supportChannels,
  businessHours,
  beforeContactingTips,
  infoToPrepare,
  commonScenarios,
  SupportInfoItem,
} from '@utils/dummyData/support';
import useMediaQuery from '@hooks/useMediaQuery';
import WebButton from '@components/Buttons/WebButton';

function SupportInfoList({ items }: { items: SupportInfoItem[] }) {
  return (
    <ul className="ps-3 mb-0">
      {items.map((item) => (
        <li key={item.title} className="mb-2" style={{ fontSize: 15 }}>
          <span className="fw-semibold text-dark">{item.title}</span>
          <span className="text-muted d-block">{item.description}</span>
        </li>
      ))}
    </ul>
  );
}

function SupportContent() {
  const sm = useMediaQuery('sm-max');

  return (
    <div className="container-fluid bg-white font-opensans py-5">
      <Container className="pb-5 px-md-2 px-md-3">
        <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
          Dukungan Pelanggan
        </h6>
        <h2
          className={clsx('fw-extrabold text-center mb-3 text-accent1', {
            'display-6': sm,
            'display-5': !sm,
          })}
        >
          Butuh Bantuan? Kami Siap Membantu
        </h2>
        <p
          className="text-center text-grey mb-5 mx-auto"
          style={{ maxWidth: 640, fontSize: 17 }}
        >
          Pilih saluran komunikasi yang paling sesuai untuk mendapatkan bantuan
          dari tim support CusCuciin.
        </p>

        {/* Support channel cards */}
        <Row className="g-4 mb-5">
          {supportChannels.map((channel) => (
            <Col key={channel.id} lg={4} md={6}>
              <Card className="h-100 border-0 shadow-sm rounded-3 text-center">
                <Card.Body className="p-4 d-flex flex-column align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-accent2 rounded-circle mb-3"
                    style={{ width: 64, height: 64 }}
                  >
                    <AppIcon
                      name={channel.icon}
                      size={28}
                      className="text-white"
                    />
                  </div>
                  <Card.Title as="h3" className="h5 fw-bold text-accent1 mb-2">
                    {channel.title}
                  </Card.Title>
                  <Card.Text
                    className="text-grey flex-grow-1"
                    style={{ fontSize: 15 }}
                  >
                    {channel.description}
                  </Card.Text>
                  <WebButton
                    href={channel.href}
                    target={channel.id === 'whatsapp' ? '_blank' : undefined}
                    rel={
                      channel.id === 'whatsapp'
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    variant="accent1"
                    className="mt-3"
                  >
                    {channel.ctaLabel}
                  </WebButton>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Business hours */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card className="border-0 shadow-sm rounded-3 bg-light">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <AppIcon name="Clock" size={24} className="text-accent2" />
                  <h3 className="h5 fw-bold text-accent1 mb-0">
                    Jam Operasional
                  </h3>
                </div>
                <Row className="g-3">
                  <Col md={4}>
                    <p className="text-muted mb-0 small fw-semibold">
                      Hari Operasional
                    </p>
                    <p className="text-dark mb-0">{businessHours.days}</p>
                  </Col>
                  <Col md={4}>
                    <p className="text-muted mb-0 small fw-semibold">
                      Jam Buka
                    </p>
                    <p className="text-dark mb-0">{businessHours.hours}</p>
                  </Col>
                  <Col md={4}>
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
        </Row>

        {/* Support info sections */}
        <Row className="g-4 mb-5">
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <AppIcon
                    name="Lightbulb"
                    size={20}
                    className="text-accent2"
                  />
                  <h3 className="h6 fw-bold text-accent1 mb-0">
                    Sebelum Menghubungi Support
                  </h3>
                </div>
                <SupportInfoList items={beforeContactingTips} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <AppIcon
                    name="ClipboardList"
                    size={20}
                    className="text-accent2"
                  />
                  <h3 className="h6 fw-bold text-accent1 mb-0">
                    Informasi yang Disiapkan
                  </h3>
                </div>
                <SupportInfoList items={infoToPrepare} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <AppIcon
                    name="AlertCircle"
                    size={20}
                    className="text-accent2"
                  />
                  <h3 className="h6 fw-bold text-accent1 mb-0">
                    Skenario Umum
                  </h3>
                </div>
                <SupportInfoList items={commonScenarios} />
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
              <Button variant="accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="HelpCircle" size={18} />
                  FAQ
                </span>
              </Button>
            </Link>
            <Link href="/help" passHref legacyBehavior>
              <Button variant="outline-accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="BookOpen" size={18} />
                  Panduan
                </span>
              </Button>
            </Link>
            <Link href="/kontak" passHref legacyBehavior>
              <Button variant="outline-accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="MapPin" size={18} />
                  Kontak
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SupportContent;
