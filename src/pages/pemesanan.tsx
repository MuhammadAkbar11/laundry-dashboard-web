/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-new */
import React from 'react';
import clsx from 'classnames';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { GetServerSidePropsContext } from 'next';
import { getMemberSessionService } from '@services/authMemberService';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { IMemberAuth, IMemberProfile } from '@interfaces';
import {
  MemberOrderInputTypes,
  memberOrderSchema,
} from '@utils/schema/memberSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import WebButton from '@components/Buttons/WebButton';
import useGetLaundryServices from '@hooks/useGetLaundryServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import useNotification from '@hooks/useNotification';
import useGetMemberProfile from '@hooks/useGetMemberProfile';
import { getMemberProfileService } from '@services/profileService';
import { postMemberOrderService } from '@services/memberService';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

type Props = {
  profile: IMemberProfile;
};

export default function LoginPage({ profile: initialProfile }: Props) {
  const TITLE = `Pemesanan | ${APP_NAME}`;

  const notif = useNotification();
  const router = useRouter();
  const profileQuery = useGetMemberProfile({ initialData: initialProfile });
  const profile = profileQuery?.data;
  const dataServiceQuery = useGetLaundryServices('web');

  const methods = useForm<MemberOrderInputTypes>({
    resolver: zodResolver(memberOrderSchema),
    defaultValues: {
      deliveryAddress: profile?.customer?.address || '',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
    reset: formReset,
  } = methods;

  const mutation = useMutation(postMemberOrderService);
  const onSubmitHandler = (inputs: MemberOrderInputTypes) => {
    mutation.mutate(inputs, {
      onSuccess(data: any) {
        notif.success(data?.message as string);
        formReset();
        router.push(
          `/pemesanan-berhasil?laundryQueue=${data?.order?.laundryQueue?.laundryQueueId}`
        );
      },
      onError(error: any) {
        const errMessage = error?.message || 'Order Gagal!';
        notif.danger(errMessage);
      },
    });
  };

  const deliveryType = watch('deliveryType');
  const servicesValues = watch('services');

  const selectedServices = React.useMemo(() => {
    if (dataServiceQuery?.data && servicesValues) {
      return dataServiceQuery?.data?.filter((item) =>
        servicesValues?.includes(item.serviceId)
      );
    }
    return [];
  }, [dataServiceQuery?.data, servicesValues]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Pemesanan"
        size="sm"
        history={[{ name: 'Pemesanan', disabled: true }]}
      />
      <div className="container-fluid bg-white font-opensans py-5  ">
        <Container className="pb-5 px-md-2 px-md-3">
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <Row>
              <Col md={7} lg={8} className="h-100">
                <div className="mb-4">
                  <h2 className="h2 text-accent1 fw-bold mb-1">Layanan</h2>
                  <small className="text-muted">
                    Silahkan pilih layanan yang anda pakai
                  </small>
                  <Form.Group className="mt-2">
                    <div className="row checkbox-services px-2 ">
                      {dataServiceQuery?.data?.map((srv) => {
                        return (
                          <label
                            key={srv.serviceId}
                            htmlFor={`service-${srv.serviceId}`}
                            className="col-md-6 col-lg-4 p-1 cursor-pointer"
                          >
                            <input
                              className="d-none"
                              type="checkbox"
                              value={srv.serviceId}
                              id={`service-${srv.serviceId}`}
                              {...register('services')}
                            />
                            <div className="checkbox-service-card p-3 text-wrap h-100 border w-100 rounded shadow-none ">
                              <span className="icon-checked">
                                <FontAwesomeIcon icon={faCheckCircle} />
                              </span>
                              <p className="my-0 text-center text-wrap ">
                                {srv.name}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </Form.Group>
                  {formErrors?.services?.message ? (
                    <Form.Text className="text-danger pt-1">
                      {formErrors?.services?.message}
                    </Form.Text>
                  ) : null}
                </div>
                <div className="mb-4">
                  <h2 className="h2 text-accent1 fw-bold mb-3 ">
                    Penjemputan / Pengiriman
                  </h2>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="deliveryType">
                      Pilih Jenis Pengiriman
                    </Form.Label>
                    <Form.Select
                      size="lg"
                      id="deliveryType"
                      className="py-3"
                      isInvalid={!!formErrors?.deliveryType}
                      {...register('deliveryType')}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Pilih Jenis Penjemputan / Pengiriman
                      </option>
                      <option value="DELIVERED">
                        Delivered (Jemput Antar)
                      </option>
                      <option value="PICKUP">
                        Self Pickup (Antar Jemput Sendiri)
                      </option>
                    </Form.Select>
                    {formErrors?.deliveryType?.message ? (
                      <Form.Control.Feedback type="invalid" className=" pt-1">
                        {formErrors?.deliveryType?.message}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col>
                      <Form.Label htmlFor="pickupAt.date">
                        Tanggal{' '}
                        {deliveryType === 'PICKUP'
                          ? 'Penyerahan'
                          : 'Penjemputan'}
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="pickupAt.date"
                        className="py-3"
                        isInvalid={!!formErrors?.pickupAt?.date}
                        {...register('pickupAt.date')}
                      />
                      {formErrors?.pickupAt?.date?.message ? (
                        <Form.Control.Feedback type="invalid" className=" pt-1">
                          {formErrors?.pickupAt.date?.message}
                        </Form.Control.Feedback>
                      ) : null}
                    </Col>
                    <Col>
                      <Form.Label htmlFor="pickupAt.time">
                        Waktu{' '}
                        {deliveryType === 'PICKUP'
                          ? 'Penyerahan'
                          : 'Penjemputan'}{' '}
                      </Form.Label>

                      <Form.Control
                        type="time"
                        id="pickupAt.time"
                        className="py-3"
                        isInvalid={!!formErrors?.pickupAt?.time}
                        {...register('pickupAt.time')}
                      />
                      {formErrors?.pickupAt?.time?.message ? (
                        <Form.Control.Feedback type="invalid" className=" pt-1">
                          {formErrors?.pickupAt.time?.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Text className=" pt-1">
                          Jam kerja 07:00 AM sd 17:00 PM
                        </Form.Text>
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="deliveryAddress">Alamat</Form.Label>
                    <Form.Control
                      size="lg"
                      as="textarea"
                      type="text"
                      id="deliveryAddress"
                      placeholder="Masukan alamant"
                      className="py-3"
                      isInvalid={!!formErrors?.deliveryAddress}
                      rows={3}
                      {...register('deliveryAddress')}
                    />
                    {formErrors?.deliveryAddress?.message ? (
                      <Form.Control.Feedback type="invalid" className=" pt-1">
                        {formErrors?.deliveryAddress?.message}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                </div>
                <div className="mb-4">
                  <h2 className="h2 text-accent1 fw-bold mb-3 ">Catatan</h2>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="note">Catatan</Form.Label>
                    <Form.Control
                      size="lg"
                      as="textarea"
                      type="text"
                      id="note"
                      placeholder="Masukan catatan anda"
                      className="py-3"
                      isInvalid={!!formErrors?.note}
                      rows={3}
                      {...register('note')}
                    />
                    {formErrors?.note?.message ? (
                      <Form.Control.Feedback type="invalid" className=" pt-1">
                        {formErrors?.note?.message}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                </div>
                {/* <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2 text-accent1 text-uppercase fw-bold ">
                    Login
                  </h1>
                </div>

              </div> */}
              </Col>
              <Col md={5} lg={4}>
                <Card className="border">
                  <Card.Body>
                    <Card.Title as="h3" className="mb-4 text-dark ">
                      Informasi
                    </Card.Title>
                    <div className={clsx('mb-3')}>
                      <div className="d-flex flex-column flex-md-row w-100 justify-content-between">
                        <h5 className="text-grey">Jumlah Layanan</h5>
                        <h5 className="fw-bold text-dark">
                          {servicesValues?.length || 0} Layanan
                        </h5>
                      </div>
                      {dataServiceQuery?.data ? (
                        <>
                          {servicesValues?.length > 0 ? (
                            <hr className="mt-1" />
                          ) : null}
                          {selectedServices.map((srv) => {
                            return (
                              <div
                                key={srv.serviceId}
                                className="d-flex flex-column flex-md-row w-100 justify-content-between mb-1"
                              >
                                <h5 className=" text-grey">{srv.name}</h5>
                                <h5 className="fw-bold text-dark">
                                  {uRupiah(Number(srv?.price) || 0)} /{' '}
                                  {srv?.unit === 'KG' ? '1 kg' : '1 Satuan'}
                                </h5>
                              </div>
                            );
                          })}
                        </>
                      ) : null}
                    </div>
                    <hr className="mt-1" />
                    <Card.Title as="h3" className="mb-3 text-dark">
                      Kontak
                    </Card.Title>
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex flex-column flex-md-row w-100 justify-content-between">
                        <h5 className="text-grey">Nama</h5>
                        <h5 className="fw-bold text-dark">
                          {profile?.customer?.name}
                        </h5>
                      </div>
                      <div className="d-flex flex-column flex-md-row w-100 justify-content-between">
                        <h5 className="text-grey">Email</h5>
                        <h5 className="fw-bold text-dark"> {profile?.email}</h5>
                      </div>
                      <div className="d-flex flex-column flex-md-row w-100 justify-content-between">
                        <h5 className="text-grey">No Telp</h5>
                        <h5 className="fw-bold text-dark">
                          {profile?.customer?.phone}
                        </h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div>
              <WebButton type="submit" isLoading={mutation.isLoading}>
                Pesan Sekarang
              </WebButton>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const url = uReplaceURL(ctx.req.url as string);
  try {
    const memberAuth = (await getMemberSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    const profile = await getMemberProfileService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    });

    return {
      props: {
        memberAuth,
        profile,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (uIsUnauthorizedError(err) || uIsForbiddenError(err)) {
      return {
        redirect: {
          destination: `/login?redirect=${url}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        errorCode: uGetStatusCode(err),
        memberAuth: null,
      },
    };
  }
}

LoginPage.layout = WebLayout;
