import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';

type Props = {};

function FooterNewsLetter({}: Props) {
  return (
    <Col lg={3} md={6} mb={5}>
      <h4 className="text-white mb-4">Newsletter</h4>
      <Form action="">
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
      </Form>
    </Col>
  );
}

export default FooterNewsLetter;
