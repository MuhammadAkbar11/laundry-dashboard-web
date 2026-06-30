/* eslint-disable react/require-default-props */
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import clsx from 'classnames';
import Link from 'next/link';
import AppIcon from '@components/Icons/AppIcon';
import EmptyState from '@components/Web/EmptyState/EmptyState';
import { GuideSection } from '@utils/dummyData/guides';
import useMediaQuery from '@hooks/useMediaQuery';

type Props = {
  sections: GuideSection[];
};

function HelpGuides({ sections }: Props) {
  const sm = useMediaQuery('sm-max');
  const hasContent = sections.length > 0;

  if (!hasContent) {
    return (
      <Container className="py-5">
        <EmptyState
          title="Belum ada panduan"
          description="Panduan akan segera ditambahkan. Silakan hubungi kami jika butuh bantuan."
        />
      </Container>
    );
  }

  return (
    <div className="container-fluid bg-white font-opensans py-5">
      <Container className="pb-5 px-md-2 px-md-3">
        <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
          Pusat Panduan
        </h6>
        <h2
          className={clsx('fw-extrabold text-center mb-3 text-accent1', {
            'display-6': sm,
            'display-5': !sm,
          })}
        >
          Panduan Menggunakan CusCuciin
        </h2>
        <p
          className="text-center text-grey mb-5 mx-auto"
          style={{ maxWidth: 640, fontSize: 17 }}
        >
          Ikuti langkah-langkah berikut untuk memaksimalkan pengalaman laundry
          Anda.
        </p>

        <Row className="g-4">
          {sections.map((section) => (
            <Col key={section.id} lg={6} md={12}>
              <Card className="h-100 border-0 shadow-sm rounded-3 guide-card">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-accent2 rounded-circle flex-shrink-0"
                      style={{ width: 52, height: 52 }}
                    >
                      <AppIcon
                        name={section.icon}
                        size={24}
                        className="text-white"
                      />
                    </div>
                    <div>
                      <Card.Title
                        as="h3"
                        className="h5 fw-bold text-accent1 mb-1"
                      >
                        {section.title}
                      </Card.Title>
                      <Card.Text
                        className="text-grey m-0"
                        style={{ fontSize: 15 }}
                      >
                        {section.description}
                      </Card.Text>
                    </div>
                  </div>

                  <ol className="ps-3 mb-0">
                    {section.steps.map((step) => (
                      <li
                        key={`${section.id}-${step.title}`}
                        className="mb-2"
                        style={{ fontSize: 15 }}
                      >
                        <span className="fw-semibold text-dark">
                          {step.title}
                        </span>
                        <span className="text-muted d-block">
                          {step.description}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5 pt-3 border-top">
          <p className="text-muted mb-3">
            Masih butuh bantuan? Kami siap membantu Anda.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link href="/faq" passHref legacyBehavior>
              <Button variant="accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="HelpCircle" size={18} />
                  Lihat FAQ
                </span>
              </Button>
            </Link>
            <Link href="/kontak" passHref legacyBehavior>
              <Button variant="outline-accent1" size="lg" as="a">
                <span className="d-flex gap-2 align-items-center">
                  <AppIcon name="Mail" size={18} />
                  Hubungi Support
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default HelpGuides;
