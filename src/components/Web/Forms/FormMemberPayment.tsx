import React from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BANKS, PAYMENT_METHODS } from '@configs/varsConfig';
import {
  faCheckCircle,
  faHandHoldingDollar,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MemberPaymentInputTypes,
  memberPaymentSchema,
} from '@utils/schema/memberSchema';
import { ILaundryItem, ILaundryQueue } from '@interfaces';
import { uRupiah } from '@utils/utils';
import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { useRouter } from 'next/router';
import WebButton from '@components/Buttons/WebButton';
import { postMemberPaymentService } from '@services/memberService';

type Props = {
  laundryQueue: ILaundryQueue;
  laundries: ILaundryItem[];
};

function FormMemberPayment({ laundries, laundryQueue }: Props) {
  const notif = useNotification();
  const router = useRouter();
  const methods = useForm<MemberPaymentInputTypes>({
    resolver: zodResolver(memberPaymentSchema),
    defaultValues: { paymentMethod: '', proof: null },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
    reset: formReset,
  } = methods;

  const laundryRoom = laundryQueue?.laundryRoom;
  const customer = laundryQueue?.customer;

  const mutation = useMutation(postMemberPaymentService);
  const onSubmitHandler = (inputs: MemberPaymentInputTypes) => {
    mutation.mutate(
      { ...inputs, laundryQueueId: laundryQueue?.laundryQueueId as string },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess() {
          formReset();
          router.push(
            `/pembayaran/sukses?laundryQueue=${laundryQueue?.laundryQueueId}`
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError(error: any) {
          const errMessage =
            `${error?.message}. Silahkan hubungi Admin jika telah melakukan pembayaran` ||
            'Pembayaran Gagal! Silahkan hubungi Admin jika telah melakukan pembayaran';
          notif.danger(errMessage);
        },
      }
    );
  };

  const totalDiscount = customer?.customerLevel
    ? (Number(laundryRoom?.total || 0) *
        Number(customer?.customerLevel?.discount || 0)) /
      100
    : 0;

  const paymentMethod = watch('paymentMethod');

  return (
    <Form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="h-100 d-flex flex-column"
    >
      <Row>
        <Col md={7} className="h-100">
          <div className="mb-4">
            <h2 className="h2 text-accent1 fw-bold mb-1">Metode Pembayaran</h2>
            <small className="text-muted">
              Silahkan pilih metode pembayaran
            </small>
            <Form.Group className="mt-2">
              <div className="row radio-cards px-2">
                {PAYMENT_METHODS?.map((pay, idx) => {
                  const key = idx;
                  return (
                    <label
                      key={key}
                      htmlFor={`payment-${pay.value}`}
                      className="col-md-6 col-lg-6 cursor-pointer p-1"
                    >
                      <input
                        className="d-none"
                        type="radio"
                        defaultValue={pay?.value || ''}
                        id={`payment-${pay.value}`}
                        {...register('paymentMethod')}
                      />
                      <div className="radio-card p-3 text-wrap h-100 w-100 rounded shadow-none  ">
                        <span className="icon-checked">
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </span>
                        <p className="my-0 h4 d-flex align-items-center gap-2 flex-column text-wrap text-capitalize ">
                          <FontAwesomeIcon
                            className="fa-fw"
                            size="2xl"
                            icon={
                              pay.value === 'CASH'
                                ? faHandHoldingDollar
                                : faMoneyBillTransfer
                            }
                          />
                          <span className="ms-1">{pay.name}</span>
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {formErrors?.paymentMethod?.message ? (
                <Form.Text className="text-danger pt-1">
                  {formErrors?.paymentMethod?.message}
                </Form.Text>
              ) : null}
            </Form.Group>
          </div>
          {paymentMethod === 'BANK_TRANSFER' ? (
            <>
              {' '}
              <div className="p-0 w-100 mb-4">
                <h2 className="h2 text-accent1 fw-bold mb-1">Daftar Bank</h2>
                <small className="text-muted">
                  Anda bisa melakukan transfer ke Beberapa Bank di bawah Ini{' '}
                </small>
                <Form.Group className="mt-2">
                  {' '}
                  <div className="row px-2">
                    {BANKS?.map((bnk, idx) => {
                      const key = idx;
                      return (
                        <div key={key} className="col-6 col-lg-4 p-1">
                          <Card className="h-100 w-100 rounded shadow-none bg-light ">
                            <Card.Body className="pb-0">
                              <h4 className="mb-1 fw-bold text-primary text-wrap text-capitalize  ">
                                <span>{bnk?.no_rek}</span>
                              </h4>
                              <p className="text-spacing-0  text-capitalize mb-1">
                                {bnk?.name}
                              </p>
                              <Card.Title className="mt-1 mb-0">
                                {bnk?.bank_name}
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </Form.Group>
              </div>{' '}
              <div>
                <h2 className="h2 text-accent1 fw-bold mb-1">
                  Bukti Pembayaran
                </h2>
                <small className="text-muted">
                  Jika telah melakukan pembayaran silahkan upload bukti
                  pembayarannya
                </small>
                <Form.Group className="mt-3">
                  <Form.Control
                    type="file"
                    size="lg"
                    {...register('proof', {
                      required: paymentMethod === 'BANK_TRANSFER',
                    })}
                  />
                  {formErrors?.proof?.message ? (
                    <Form.Text className="text-danger pt-1">
                      {(formErrors?.proof?.message as string) || ''}
                    </Form.Text>
                  ) : null}
                </Form.Group>
              </div>
            </>
          ) : null}
        </Col>
        <Col md={5} lg={5}>
          <Card className="border">
            <Card.Body>
              <Card.Title as="h3" className="mb-4 text-dark ">
                Cucian
              </Card.Title>
              <div className="mb-3">
                {laundries
                  ? laundries?.map((lnd) => {
                      return (
                        <div
                          key={lnd?.laundryId}
                          className="d-flex flex-column mb-2 flex-md-row w-100 justify-content-between"
                        >
                          <h5 className="text-grey w-100 d-flex justify-content-md-between gap-2 ">
                            <span>{lnd?.historyService?.name} </span>
                            <span className=" text-capitalize text-accent1 me-md-3 ">
                              {lnd?.quantity}
                              {lnd?.historyService?.unit === 'KG'
                                ? ' Kg'
                                : ' Ptng'}
                            </span>
                          </h5>
                          <h5 className="fw-bold text-dark text-start w-100  ">
                            <span>
                              {uRupiah(Number(lnd?.totalPrice) as number)}
                            </span>
                          </h5>
                        </div>
                      );
                    })
                  : null}
                <hr className="mt-1" />
                <Card.Title as="h3" className="mb-3 text-dark">
                  Biaya
                </Card.Title>
                <div className="d-flex flex-column mb-2 flex-md-row w-100 justify-content-between">
                  <h5 className="text-grey w-100 ">Subtotal</h5>
                  <h5 className="fw-bold text-start text-dark  w-100  ">
                    <span>{uRupiah(laundryRoom?.total as number)}</span>
                  </h5>
                </div>
                <div className="d-flex flex-column mb-2 flex-md-row w-100 justify-content-between">
                  <h5 className="text-grey w-100 ">
                    Disc ({customer?.customerLevel?.discount}%)
                  </h5>
                  <h5 className="fw-bold text-start text-dark  w-100  ">
                    <span>{uRupiah(totalDiscount)}</span>
                  </h5>
                </div>
                <hr className="mt-1" />
                <div className="d-flex flex-column mb-2 flex-md-row w-100 justify-content-between">
                  <h4 className="fw-bolder w-100 ">Total</h4>
                  <h4 className="fw-bolder text-start w-100  ">
                    <span>
                      {uRupiah(
                        Number(laundryRoom?.total as number) - totalDiscount
                      )}
                    </span>
                  </h4>
                </div>
              </div>
              {/* <hr className="mt-1" /> */}
            </Card.Body>
            <Card.Footer className="">
              <WebButton
                type="submit"
                className="w-100"
                disabled={mutation?.isSuccess}
                isLoading={mutation.isLoading}
              >
                Konfirmasi Pembayaran
              </WebButton>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Form>
  );
}

export default FormMemberPayment;
