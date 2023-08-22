import React from 'react';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col } from 'react-bootstrap';

type Props = {};

function FooterNewsLetter({}: Props) {
  return (
    <Col lg={3} md={6} mb={5} className="">
      <h4 className="text-white mb-4">Ikuti Kami</h4>
      <div className="d-flex justify-content-start mt-4">
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 px-0 d-flex align-items-center justify-content-center "
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 d-flex align-items-center justify-content-center  px-0"
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 px-0 d-flex align-items-center justify-content-center "
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          className="btn btn-outline-light rounded-circle text-center me-2 px-0 d-flex align-items-center justify-content-center "
          href="#/"
          style={{ height: 38, width: 38 }}
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
      {/* <Form action="">
        <Form.Group className=" mb-3">
          <Form.Control
            size="lg"
            type="text"
            className="form-control border-0 rounded-0"
            placeholder="Nama Anda"
            required
          />
        </Form.Group>
        <Form.Group className=" mb-3">
          <Form.Control
            size="lg"
            type="email"
            className="form-control border-0 rounded-0"
            placeholder="Email Anda"
            required
          />
        </Form.Group>
        <div className="d-flex">
          <Button
            variant="accent2"
            className=" w-100 btn-block border-0 py-2 rounded-0"
            type="submit"
          >
            Kirim
          </Button>
        </div>
      </Form> */}
    </Col>
  );
}

export default FooterNewsLetter;
