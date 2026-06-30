/* eslint-disable react/require-default-props */
import React from 'react';
import { Accordion, Container, Row, Col, Button } from 'react-bootstrap';
import clsx from 'classnames';
import Link from 'next/link';
import AppIcon from '@components/Icons/AppIcon';
import EmptyState from '@components/Web/EmptyState/EmptyState';
import { FaqCategory } from '@utils/dummyData/faqs';
import useMediaQuery from '@hooks/useMediaQuery';

type Props = {
  categories: FaqCategory[];
};

function FaqAccordion({ categories }: Props) {
  const sm = useMediaQuery('sm-max');
  const hasContent = categories.length > 0;

  if (!hasContent) {
    return (
      <Container className="py-5">
        <EmptyState
          title="Belum ada FAQ"
          description="FAQ akan segera ditambahkan. Silakan hubungi kami jika ada pertanyaan."
        />
      </Container>
    );
  }

  return (
    <div className="container-fluid bg-white font-opensans py-5">
      <Container className="pb-5 px-md-2 px-md-3">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <h6 className="text-uppercase text-center fw-semibold text-accent2 mb-3">
              Pusat Bantuan
            </h6>
            <h2
              className={clsx('fw-extrabold text-center mb-5 text-accent1', {
                'display-6': sm,
                'display-5': !sm,
              })}
            >
              Pertanyaan yang Sering Diajukan
            </h2>

            {categories.map((category, catIdx) => {
              const catKey = category.id;
              return (
                <div key={catKey} className="mb-4">
                  <h3 className="h5 fw-bold text-accent1 mb-3">
                    {catIdx + 1}. {category.name}
                  </h3>
                  <Accordion flush className="faq-accordion">
                    {category.items.map((item, itemIdx) => {
                      const eventKey = `${catKey}-${itemIdx}`;
                      return (
                        <Accordion.Item key={eventKey} eventKey={eventKey}>
                          <Accordion.Button className="fw-semibold text-dark">
                            {item.question}
                          </Accordion.Button>
                          <Accordion.Body className="text-muted">
                            {item.answer}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                </div>
              );
            })}

            <div className="text-center mt-5 pt-3 border-top">
              <p className="text-muted mb-3">
                Tidak menemukan jawaban yang Anda cari?
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link href="/kontak" passHref legacyBehavior>
                  <Button variant="accent1" size="lg" as="a">
                    <span className="d-flex gap-2 align-items-center">
                      <AppIcon name="Mail" size={18} />
                      Hubungi Kami
                    </span>
                  </Button>
                </Link>
                <Link href="/layanan" passHref legacyBehavior>
                  <Button variant="outline-accent1" size="lg" as="a">
                    <span className="d-flex gap-2 align-items-center">
                      <AppIcon name="HelpCircle" size={18} />
                      Lihat Layanan
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FaqAccordion;
