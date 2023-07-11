import React from 'react';
import { Container, Row } from 'react-bootstrap';
import FooterContactInfo from './FooterContactInfo';
import FooterQuickLinks from './FooterQuickLinks';
import FooterNewsLetter from './FooterNewsLetter';
import FooterAbout from './FooterAbout';

type Props = {};

function FooterTop({}: Props) {
  return (
    <div className="container-fluid bg-accent1 text-white py-5 px-sm-3 px-md-5">
      <Container>
        <Row className="pt-5">
          <FooterAbout />
          <FooterContactInfo />
          <FooterQuickLinks />
          <FooterNewsLetter />
        </Row>
      </Container>
    </div>
  );
}

export default FooterTop;
