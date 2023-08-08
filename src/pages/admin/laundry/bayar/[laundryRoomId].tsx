/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-new */
import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import * as Interfaces from '@interfaces';
import { APP_NAME } from '@configs/varsConfig';
import { getSessionService } from '@services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { getDetailLaundryRoomService } from '@services/laundryRoomService';
import {
  LaundryRoomDetailProvider,
  useLaundryRoomDetailContext,
} from '@utils/context/Laundry/LaundryRoom/LaundryRoomDetailContext';
import TableRowInfo from '@components/Utils/TableRowInfo';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import useGetLaundryQueueLaundries from '@hooks/useGetLaundryQueueLaundries';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { useQuery } from '@tanstack/react-query';
import useGetCustomerLevelDetail from '@hooks/useGetCustomerLevelDetail';
import BoxButton from '@components/Buttons/BoxButton';
import {
  LaundryPaymentProvider,
  useLaundryPaymentContext,
} from '@utils/context/Laundry/LaundryPaymentContext';
import ModalProcessLaundryPayment from '@components/Modals/ModalProcessLaundryPayment';
import {
  LaundryPaymentRespondProvider,
  useLaundryPaymentRespondContext,
} from '@utils/context/Laundry/LaundryPaymentRespondContext';
import ModalRespondLaundryPayment from '@components/Modals/ModalRespondLaundryPayment';

type IPaymentOriginal = Omit<Interfaces.IPayment, 'laundryQueue' | 'user'>;
type Props = {
  laundryRoom: Interfaces.ILaundryRoom;
};

export default function DetailRoomPage(props: Props) {
  const TITLE = `Pembayaran Laundry | ${APP_NAME}`;

  const { laundryRoom: laundryRoomDefaultData } = props;

  const [secondsRedirect, setSecondsRedirect] = React.useState(5);

  const notif = useNotification();
  const router = useRouter();
  const laundryRoomIdParam = router.query?.laundryRoomId;

  const laundryRoomCtx = useLaundryRoomDetailContext();
  const laundryPaymentCtx = useLaundryPaymentContext();
  const laundryPaymentRespondCtx = useLaundryPaymentRespondContext();

  const laundryRoomQueryKey = React.useMemo(
    () => ['laundryRoomDetail', { laundryRoomId: laundryRoomIdParam }],
    [laundryRoomIdParam]
  );

  const { data: laundryRoom, isLoading: laundryRoomLoading } = useQuery<
    unknown,
    unknown,
    Interfaces.ILaundryRoom
  >({
    queryKey: laundryRoomQueryKey,
    queryFn: () => getDetailLaundryRoomService(laundryRoomIdParam as string),
    initialData: laundryRoomDefaultData,
  });

  const laundriesDataQuery = useGetLaundryQueueLaundries(
    laundryRoom?.laundryQueueId as string
  );

  const { data: customerLevelDataQuery } = useGetCustomerLevelDetail(
    laundryRoom?.laundryQueue?.customer?.customerLevelId as string
  );

  React.useEffect(() => {
    if (!laundryRoomLoading) laundryRoomCtx.onSetLaundryRoom(laundryRoom);
  }, [laundryRoom, laundryRoomCtx, laundryRoomLoading]);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (laundryPaymentCtx.isSuccess) {
      if (secondsRedirect > 0) {
        const timer = setInterval(() => {
          setSecondsRedirect((prevSeconds: number) => prevSeconds - 1);
          notif.remove(`pay-success-redirect-${secondsRedirect + 1}`);
          notif.info(`Halaman akan di arahkan dalam ${secondsRedirect}`, {
            id: `pay-success-redirect-${secondsRedirect}`,
            duration: 1000,
          });
        }, 1000);

        return () => {
          clearInterval(timer);
        };
      } else {
        notif.remove(`pay-success-redirect-${secondsRedirect + 1}`);
        router.push(
          `/admin/laundry/admin/laundry/room/${laundryRoom?.laundryRoomId}`
        );
        return () => {};
      }
    }
  }, [notif, secondsRedirect, laundryPaymentCtx, router, laundryRoom]);

  useEffectRun(
    () => {
      if (laundriesDataQuery.isError) {
        notif.danger('Gagal mengambil data cucian');
      }
    },
    () => {},
    [laundriesDataQuery, notif]
  );

  const totalDiscount = customerLevelDataQuery
    ? (Number(laundryRoom?.total || 0) *
        Number(customerLevelDataQuery?.discount || 0)) /
      100
    : 0;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-4">Pembayaran</h1>
        <Row className="">
          <Col xs={12} md={6} lg={7}>
            <Card>
              <Card.Header className="pt-4">
                <Card.Title className=" mb-0">Informasi</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <TableRowInfo
                      label="ID Antrian"
                      value={<span>{laundryRoom?.laundryQueueId}</span>}
                    />
                    <TableRowInfo
                      label="Nama Pelanggan"
                      value={
                        <span>
                          {laundryRoom?.laundryQueue?.customer?.name || '-'}
                        </span>
                      }
                    />
                    <TableRowInfo
                      label="Level Pelanggan"
                      value={<span>{customerLevelDataQuery?.name || ''}</span>}
                    />
                    <TableRowInfo
                      label="Diskon Level"
                      value={
                        <span>
                          {`${customerLevelDataQuery?.discount}%` || ''}
                        </span>
                      }
                    />
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header className=" pt-4 d-flex justify-content-between ">
                <Card.Title className=" mb-0">Daftar Item Cucian</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover size="lg">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Jenis Layanan</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableLoadingRow
                        isError={laundriesDataQuery?.isError}
                        rows={
                          laundriesDataQuery?.data as Interfaces.ILaundryItem[]
                        }
                        isLoading={laundriesDataQuery.isLoading}
                        headerLength={5}
                      />
                      {!laundriesDataQuery.isLoading
                        ? laundriesDataQuery?.data
                          ? laundriesDataQuery?.data?.map((lnd) => {
                              return (
                                <tr key={lnd.laundryId}>
                                  <td>{lnd.laundryId}</td>
                                  <td>{lnd?.historyService?.name}</td>
                                  <td className="text-nowrap">
                                    {lnd.quantity}{' '}
                                    <span
                                      style={{ textTransform: 'capitalize' }}
                                    >
                                      {lnd?.historyService?.unit?.toString()}
                                    </span>
                                  </td>
                                  <td>{uRupiah(+lnd.totalPrice)}</td>
                                </tr>
                              );
                            })
                          : null
                        : null}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={5}>
            <Card>
              <Card.Header className="pt-4">
                <Card.Title className=" mb-0">Informasi Harga</Card.Title>
              </Card.Header>
              <Card.Body className="pb-2">
                <Table borderless>
                  <tbody>
                    <TableRowInfo
                      label="Harga"
                      value={<span>{uRupiah(laundryRoom?.total)}</span>}
                    />
                    <TableRowInfo
                      label={`Disc (${customerLevelDataQuery?.discount}%)`}
                      value={<span>{uRupiah(totalDiscount)}</span>}
                    />
                    <TableRowInfo
                      label="Total Harga"
                      value={
                        <span>
                          {uRupiah(Number(laundryRoom?.total) - totalDiscount)}
                        </span>
                      }
                    />
                  </tbody>
                </Table>
              </Card.Body>
              {/* {laundryRoom?.laundryQueue?.queuePaymentStatus === 'PENDING' ? (
                <Card.Footer className="  border-top ">
                  <Form.Group className="">
                    <InputGroup className="mb-1" size="lg">
                      <Form.Control
                        aria-label="Masukan kode promo"
                        aria-describedby="basic-coupon"
                        className="rounded-0"
                        placeholder="Masukan kode promo"
                      />
                      <BoxButton variant="primary" id="button-coupon">
                        Gunakan
                      </BoxButton>
                    </InputGroup>
                  </Form.Group>
                </Card.Footer>
              ) : null} */}
              <Card.Footer className=" border-top d-flex flex-column ">
                {laundryRoom?.laundryQueue?.queuePaymentStatus === 'PENDING' ? (
                  <BoxButton
                    className="w-100"
                    size="lg"
                    onClick={() => {
                      // laundryRoomQueryKey
                      laundryPaymentCtx.onOpenModal({
                        totalDiscount,
                        totalPrice: Number(
                          (laundryRoom?.total as number) - totalDiscount
                        ),
                        laundryRoom,
                        fetchQueryKey: laundryRoomQueryKey,
                      });
                    }}
                  >
                    Proses Bayar
                  </BoxButton>
                ) : null}
                {laundryRoom?.laundryQueue?.queuePaymentStatus ===
                  'PROCESSED' && laundryRoom?.laundryQueue?.payment ? (
                  <div className="d-flex gap-2">
                    <BoxButton
                      className="w-100 text-dark"
                      size="lg"
                      variant="warning"
                      onClick={() => {
                        laundryPaymentRespondCtx.onOpen({
                          payment: laundryRoom?.laundryQueue
                            ?.payment as IPaymentOriginal,
                          totalDiscount,
                          totalPrice: Number(
                            (laundryRoom?.total as number) - totalDiscount
                          ),
                        });
                      }}
                    >
                      Tanggapi Pembayaran
                    </BoxButton>
                    {/* {laundryRoom?.laundryQueue?.payment?.paymentMethod ===
                    'BANK_TRANSFER' ? (
                      <BoxButton
                        className="w-100"
                        size="lg"
                        variant="outline-warning"
                        onClick={() => {
                          laundryPaymentRespondCtx.onOpen(
                            laundryRoom?.laundryQueue
                              ?.payment as IPaymentOriginal
                          );
                        }}
                      >
                        Bukti Pembayaran
                      </BoxButton>
                    ) : null} */}
                  </div>
                ) : null}
                {laundryRoom?.laundryQueue?.queuePaymentStatus ===
                'FINISHED' ? (
                  <BoxButton
                    className="w-100"
                    size="lg"
                    icon="CheckCircle"
                    iconPos="end"
                    variant="success"
                  >
                    Lunas
                  </BoxButton>
                ) : null}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <ModalProcessLaundryPayment />
      <ModalRespondLaundryPayment />
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const headers = { Cookie: cookies, 'User-Agent': userAgent };

  const url = uReplaceURL(ctx.req.url as string);
  try {
    const userAuth = (await getSessionService({
      headers,
    })) as Interfaces.IUserAuth;
    if (!userAuth) return uNotAuthRedirect(url);

    const hasPermission = await uCheckPermissions(userAuth, url as string);

    const laundryRoomId = ctx.params?.laundryRoomId;

    if (!laundryRoomId || laundryRoomId === 'undefined') {
      return {
        redirect: {
          destination: '/admin/laundry/room',
          permanent: false,
        },
      };
    }

    const laundryRoom = await getDetailLaundryRoomService(
      laundryRoomId as string,
      { headers }
    );
    if (!laundryRoom) {
      return {
        redirect: {
          destination: '/admin/laundry/room',
          permanent: false,
        },
      };
    }

    return {
      props: {
        userAuth,
        laundryRoom,
        isRestricted: !hasPermission,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (uIsUnauthorizedError(err) || uIsForbiddenError(err)) {
      return {
        redirect: {
          destination: `/admin/login?redirect=${url}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        errorCode: uGetStatusCode(err),
        userAuth: null,
      },
    };
  }
}

DetailRoomPage.providers = [
  LaundryRoomDetailProvider,
  LaundryPaymentRespondProvider,
  LaundryPaymentProvider,
];

DetailRoomPage.layout = AdminLayout;
