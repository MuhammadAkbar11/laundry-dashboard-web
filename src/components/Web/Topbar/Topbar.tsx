import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';

type Props = {};

function Topbar({}: Props) {
  return (
    <Container fluid className="bg-accent1 py-4">
      <Container>
        <Row>
          <Col
            md={6}
            className="text-center text-md-start mb-2 mb-lg-0 ps-lg-4"
          >
            <div className="d-inline-flex align-items-center gap-3">
              <a className="text-white " href="#/">
                FAQs
              </a>
              <span className="text-white">|</span>
              <a className="text-white " href="#/">
                Help
              </a>
              <span className="text-white">|</span>
              <a className="text-white " href="#/">
                Support
              </a>
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end pe-lg-4">
            <div
              className="d-inline-flex align-items-center gap-4"
              style={{ fontSize: 18 }}
            >
              <a
                className="text-white "
                href="https://www.facebook.com/laundry.tantelaundry71"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                className="text-white "
                href="https://twitter.com/tantelaundry71"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                className="text-white "
                href="https://www.instagram.com/tantelaundry71"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a
                className="text-white "
                href="https://wa.me/your-whatsapp-number"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Topbar;
