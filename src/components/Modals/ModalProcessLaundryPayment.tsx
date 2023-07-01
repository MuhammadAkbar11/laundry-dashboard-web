/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uRupiah } from '@utils/utils';
import BoxButton from '@components/Buttons/BoxButton';
import { useLaundryPaymentContext } from '@utils/context/Laundry/LaundryPaymentContext';
import TableRowInfo from '@components/Utils/TableRowInfo';
import useNotification from '@hooks/useNotification';
import { postPaymentService } from '@services/paymentService';
// import useEffectRun from '@hooks/useEffectRan';

function ModalProcessLaundryPayment() {
  const [paidAmount, setPaidAmount] = React.useState(0);
  const [changeAmount, setChangeAmount] = React.useState(0);
  const [isSetPaidAmount, setIsSetPaidAmount] = React.useState(false);

  const notif = useNotification();

  const laundryPaymentCtx = useLaundryPaymentContext();
  const paymentCtxData = laundryPaymentCtx.data;
  const totalPrice = paymentCtxData?.totalPrice || 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryClient = useQueryClient();
  const mutation = useMutation(postPaymentService, {
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: paymentCtxData?.fetchQueryKey,
      });
    },
  });

  const handleOnCloseModal = () => {
    if (!laundryPaymentCtx.isLoading) {
      setPaidAmount(0);
      setChangeAmount(0);
      setIsSetPaidAmount(false);
      laundryPaymentCtx.onCloseModal();
    }
  };

  const handlePaymentSubmit = () => {
    laundryPaymentCtx.onSetLoading(true);
    laundryPaymentCtx.onSetSuccess(false);
    const payload = {
      paidAmount,
      laundryQueueId: paymentCtxData?.laundryRoom.laundryQueueId as string,
    };
    mutation.mutate(payload, {
      onSuccess(data: any) {
        laundryPaymentCtx.onSetSuccess(true);
        handleOnCloseModal();
        laundryPaymentCtx.onSetLoading(false);
        notif.success((data?.message as string) || 'Pembayaran berhasil', {
          duration: 6666,
        });
      },
      onError(error: any) {
        handleOnCloseModal();
        notif.danger('Gagal mengkonfirmasi pembayaran! silahkan coba lagi', {
          duration: 6666,
        });
        laundryPaymentCtx.onSetLoading(false);
        laundryPaymentCtx.onSetError(error);
      },
    });
  };

  const handleSetPaidSubmit = async () => {
    if (paidAmount >= totalPrice) {
      const change = paidAmount - Number(totalPrice || 0);
      setChangeAmount(change);
      setIsSetPaidAmount(true);
    } else {
      notif.danger('Nominal uang yang dimasukan kurang!');
    }
  };
  const handleUnsetPaidSubmit = async () => {
    setChangeAmount(0);
    setIsSetPaidAmount(false);
  };

  const handleShortcutPayment = (amount: number) => {
    setPaidAmount(amount);
  };

  const shortcutAmounts = [10000, 15000, 20000, 30000, 40000, 50000, 100000];

  return (
    <Modal
      show={laundryPaymentCtx.showModal}
      onHide={() => handleOnCloseModal()}
      backdrop="static"
      contentClassName="p-2 rounded-0"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title>Proses Pembayaran</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column ">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handlePaymentSubmit();
          }}
        >
          <div className="d-flex justify-content-center flex-column w-100 text-dark py-3">
            <p className="text-center text-success  mb-1 fw-bold text-uppercase ">
              Total{' '}
            </p>
            <h1 className="text-success text-center fw-bold  ">
              <span>{uRupiah(paymentCtxData?.totalPrice || 0)}</span>
            </h1>
          </div>
          <Form.Group controlId="paidAmount" className="mb-3">
            <Form.Label>Nominal Pembayaran:</Form.Label>
            <InputGroup size="lg">
              <InputGroup.Text id="inputGroup-sizing-lg">Rp. </InputGroup.Text>
              <Form.Control
                type={isSetPaidAmount ? 'text' : 'number'}
                size="lg"
                style={{
                  fontSize: 25,
                }}
                onChange={(e) => {
                  if (Number(e.target.value) >= 0) {
                    setPaidAmount(Number(e.target.value));
                  }
                }}
                readOnly={isSetPaidAmount}
                disabled={isSetPaidAmount}
                value={
                  isSetPaidAmount
                    ? uRupiah(Number(paidAmount))
                        .replace('Rp', '')
                        .replace(',00', '')
                    : paidAmount
                }
              />
              {!isSetPaidAmount ? (
                <BoxButton
                  variant="success"
                  size="lg"
                  onClick={() => handleSetPaidSubmit()}
                  className="text-nowrap px-5"
                >
                  Set
                </BoxButton>
              ) : (
                <BoxButton
                  variant="outline-success"
                  size="lg"
                  onClick={() => handleUnsetPaidSubmit()}
                  className="text-nowrap px-5"
                >
                  Ubah
                </BoxButton>
              )}
            </InputGroup>
          </Form.Group>
          {!isSetPaidAmount ? (
            <Form.Group className="d-flex gap-2 mb-3 justify-content-center flex-wrap  ">
              {shortcutAmounts.map((amount, index) => {
                const key = index;
                return (
                  <BoxButton
                    key={key}
                    variant="success"
                    size="lg"
                    onClick={() => handleShortcutPayment(amount)}
                    className="text-nowrap"
                  >
                    Rp {amount.toLocaleString()}
                  </BoxButton>
                );
              })}
            </Form.Group>
          ) : null}
          {isSetPaidAmount ? (
            <Row>
              <Col md={{ span: 6, offset: 6 }} lg={{ span: 6, offset: 6 }}>
                <Table className="text-dark fw-bold ">
                  <tbody>
                    <TableRowInfo
                      label="Dibayar"
                      value={
                        <div className="text-end w-100  ">
                          {uRupiah(paidAmount).replace('Rp', '')}
                        </div>
                      }
                      seperator={false}
                    />
                    <TableRowInfo
                      label="Total"
                      value={
                        <div className="text-end w-100 text-danger">
                          {uRupiah(paymentCtxData?.totalPrice || 0).replace(
                            'Rp',
                            '-'
                          )}
                        </div>
                      }
                      seperator={false}
                    />
                    <TableRowInfo
                      label="Kembali"
                      value={
                        <div className="text-end w-100 text-success ">
                          {uRupiah(+changeAmount || 0).replace('Rp', '')}
                        </div>
                      }
                      seperator={false}
                    />
                    {/* {changeAmount > 0 ? (

                    ) : null} */}
                  </tbody>
                </Table>
              </Col>
            </Row>
          ) : null}
          <div className="pt-2 d-flex justify-content-end gap-2 ">
            <BoxButton
              variant="slate"
              size="lg"
              className="text-dark"
              onClick={() => handleOnCloseModal()}
              disabled={laundryPaymentCtx.isLoading}
            >
              Batalkan
            </BoxButton>
            <BoxButton
              variant="success"
              size="lg"
              type="submit"
              icon="CheckCircle"
              // onClick={() => onLaundryQueueDelete()}
              isLoading={laundryPaymentCtx.isLoading}
              disabled={laundryPaymentCtx.isLoading || !isSetPaidAmount}
            >
              Konfirmasi Pembayaran
            </BoxButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalProcessLaundryPayment;
