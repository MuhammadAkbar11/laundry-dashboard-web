import BoxButton from '@components/Buttons/BoxButton';
import { API_URI } from '@configs/varsConfig';
import { useLaundryPaymentRespondContext } from '@utils/context/Laundry/LaundryPaymentRespondContext';
import { uDate, uRupiah } from '@utils/utils';
import Image from 'next/image';
import React from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';

type Props = {};

function ModalPaymentProofDetail({}: Props) {
  const laundryPaymentProofCtx = useLaundryPaymentRespondContext();
  const paymentData = laundryPaymentProofCtx?.data?.payment;
  const paymentAmount = uRupiah(
    Number(laundryPaymentProofCtx?.data?.totalPrice as number)
  );

  const proofImage = `${API_URI}${paymentData?.proof}`;
  const paymentMethod =
    paymentData?.paymentMethod === 'BANK_TRANSFER' ? 'Transfer Bank' : 'Tunai';
  const paymentDate = uDate(paymentData?.createdAt);
  return (
    <Modal
      show={laundryPaymentProofCtx.isOpen}
      onHide={() => laundryPaymentProofCtx.onClose()}
      backdrop="static"
      size="lg"
      contentClassName=" rounded-0  "
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="fw-bold text-dark d-none ">
          Tanggapan Pembayaran {paymentData?.laundryQueueId}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <Container className="py-5">
          <Row>
            <Col md={8} className="mx-auto">
              <div className="mb-3">
                <h3 className="text-muted fw-bold">
                  Tanggapan Pembayaran {paymentData?.laundryQueueId}
                </h3>
              </div>
              <hr className="mt-1" />
              <div className="d-flex flex-column flex-sm-row justify-content-sm-between mb-3 ">
                <h4 className=" fw-bold text-muted ">Total</h4>
                <h4 className=" fw-bold text-dark ">{paymentAmount}</h4>
              </div>
              <div className="d-flex  flex-column flex-sm-row justify-content-sm-between mb-3 ">
                <h4 className=" fw-bold text-muted ">Metode Pembayaran</h4>
                <h4 className=" fw-bold text-dark ">{paymentMethod}</h4>
              </div>
              <div className="d-flex  flex-column flex-sm-row justify-content-sm-between mb-3 ">
                <h4 className=" fw-bold text-muted ">Tanggal</h4>
                <h4 className=" fw-bold text-dark ">{paymentDate}</h4>
              </div>
              {paymentData?.proof ? (
                <>
                  <hr className="mt-1" />
                  <div className="mb-4">
                    <h4 className=" fw-bold text-muted mb-3">
                      Bukti Pembayaran
                    </h4>
                    <div
                      className="position-relative"
                      style={{
                        width: 'auot',
                        minHeight: '300px',
                      }}
                    >
                      <Image
                        fill
                        src={proofImage}
                        alt={paymentData?.paymentId || 'PaymentProof'}
                      />
                    </div>
                  </div>
                </>
              ) : null}
              <hr className="mt-1" />
              <div className=" d-flex gap-2 justify-content-end ">
                <BoxButton variant="danger" size="lg">
                  Tolak Pembayaran
                </BoxButton>

                <BoxButton size="lg">Terima Pembayaran</BoxButton>
              </div>
            </Col>
          </Row>
        </Container>
        {/* <Container fluid className="py-0">
          <Row className="justify-content-center p-0 border">
            <Col md={5} className="bg-light py-3">
              <Card className="d-flex h-100 bg-transparent shadow-none ">
                <Card.Header className=" bg-transparent ">
                  <h4 className=" text-dark fw-bold ">Tanggapan Pembayaran</h4>
                </Card.Header>
                <Card.Body className="py-1 d-flex flex-column  text   ">
                  <div>
                    <h5 className=" text-muted ">Total :</h5>
                    <h4>{paymentAmount}</h4>
                  </div>
                  <div>
                    <h5 className=" text-muted ">Total :</h5>
                    <h4>{paymentAmount}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={7} className=" position-relative ">
              <Card className="bg-transparent shadow-none ">
                <Card.Body>
                  <div
                    className="position-relative"
                    style={{
                      width: 'auot',
                      minHeight: '300px',
                    }}
                  >
                    <Image
                      fill
                      src={proofImage}
                      alt={paymentData?.paymentId || 'PaymentProof'}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container> */}
      </Modal.Body>
    </Modal>
  );
}

export default ModalPaymentProofDetail;
