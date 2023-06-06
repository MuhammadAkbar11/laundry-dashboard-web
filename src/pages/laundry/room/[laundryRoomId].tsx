/* eslint-disable no-nested-ternary */
/* eslint-disable no-new */
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Card,
  Col,
  Container,
  Form,
  Offcanvas,
  Row,
  Table,
} from 'react-bootstrap';
import * as Interfaces from '@interfaces';
import { APP_NAME } from '@configs/varsConfig';
import { getSessionService } from '@services/authSevices';
import { uDate, uNotAuthRedirect, uRupiah } from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps } from '@utils/interfaces';
import {
  ILaundryRoom,
  getDetailLaundryRoomService,
} from '@services/laundryRoomService';
import {
  LaundryRoomDetailProvider,
  useLaundryRoomDetailContext,
} from '@utils/context/Laundry/LaundryRoom/LaundryRoomDetailContext';
import TableRowInfo from '@components/Utils/TableRowInfo';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';
import useGetLaundryQueueLaundries from '@hooks/useGetLaundryQueueLaundries';
import FromCreateLaundryItem from '@components/Forms/FormLaundryItem/FormCreateLaundryItem';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface Props extends IPageProps {
  laundryRoom: ILaundryRoom;
}

export default function DetailRoomPage(props: Props) {
  const TITLE = `Ruangan Laundry | ${APP_NAME}`;

  const { userAuth, laundryRoom: laundryRoomDefaultData } = props;

  const [formCreateLaundry, setFormCreateLaundry] =
    React.useState<boolean>(false);

  const notif = useNotification();
  const router = useRouter();
  const laundryRoomIdParam = router.query?.laundryRoomId;

  const userAuthCtx = useUserAuthContext();
  const laundryRoomCtx = useLaundryRoomDetailContext();

  const { data: laundryRoom, isLoading: laundryRoomLoading } = useQuery<
    unknown,
    unknown,
    ILaundryRoom
  >({
    queryKey: ['laundryRoomDetail', { laundryRoomId: laundryRoomIdParam }],
    queryFn: () => getDetailLaundryRoomService(laundryRoomIdParam as string),
    initialData: laundryRoomDefaultData,
  });

  const laundriesDataQuery = useGetLaundryQueueLaundries(
    laundryRoom?.laundryQueueId as string
  );

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  React.useEffect(() => {
    if (!laundryRoomLoading) laundryRoomCtx.onSetLaundryRoom(laundryRoom);
  }, [laundryRoom, laundryRoomCtx, laundryRoomLoading]);

  useEffectRun(
    () => {
      if (laundriesDataQuery.isError) {
        notif.danger('Gagal mengambil data cucian');
      }
    },
    () => {},
    [laundriesDataQuery, notif]
  );

  const laundriesLength = laundriesDataQuery?.data?.length;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-4">
          Laundry Room :{' '}
          <span className="fw-bold">{laundryRoom?.laundryRoomId}</span>
        </h1>
        <Row className="row">
          <Col xs={12} md={5}>
            <Card>
              <Card.Header className="pt-4">
                <Card.Title className=" mb-0">Info Cucian</Card.Title>
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
                      label="Waktu Masuk"
                      value={<span>{uDate(laundryRoom?.createdAt)}</span>}
                    />
                    <TableRowInfo
                      label="Total Item"
                      value={<span>{laundriesLength} Cucian</span>}
                    />
                    <TableRowInfo
                      label="Total Item"
                      value={<span>{uRupiah(laundryRoom?.total)}</span>}
                    />
                  </tbody>
                </Table>
                <Form>
                  <div className="d-flex gap-2 ">
                    {laundriesLength === 0 ||
                    laundryRoom?.laundryQueue?.queuePaymentStatus ===
                      'FINISHED' ? (
                      <BoxButton disabled variant="success" icon="DollarSign">
                        Bayar
                      </BoxButton>
                    ) : (
                      <Link
                        href={`/pembayaran/${laundryRoom?.laundryQueueId}`}
                        legacyBehavior
                        passHref
                      >
                        <BoxButton variant="success" icon="DollarSign">
                          Bayar
                        </BoxButton>
                      </Link>
                    )}
                    <BoxButton
                      disabled={
                        laundriesLength === 0 ||
                        laundryRoom.status === 'FINISHED'
                      }
                      variant="success"
                      icon="CheckCircle"
                    >
                      Set selesai
                    </BoxButton>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={7}>
            <Card>
              <Card.Header className=" pt-4 d-flex justify-content-between ">
                <Card.Title className=" mb-0">Daftar Item Cucian</Card.Title>
                <BoxButton
                  icon="Plus"
                  disabled={
                    laundryRoom?.laundryQueue.queuePaymentStatus === 'FINISHED'
                  }
                  onClick={() => setFormCreateLaundry(true)}
                >
                  Tambah Cucian
                </BoxButton>
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
                        <th>Hapus</th>
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
                                  <td>
                                    <div className="d-flex gap-1 ">
                                      <div>
                                        <BoxButton
                                          size="sm"
                                          variant="blue"
                                          icon="Edit2"
                                          className="p-1"
                                          iconSize={11}
                                          onClick={() =>
                                            notif.info(
                                              'Fitur ini akan segera hadir'
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <BoxButton
                                          size="sm"
                                          iconSize={11}
                                          variant="danger"
                                          icon="Trash"
                                          className="p-1"
                                          onClick={() =>
                                            notif.info(
                                              'Fitur ini akan segera hadir'
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </td>
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
        </Row>
      </Container>
      <Offcanvas
        backdrop="static"
        placement="end"
        show={formCreateLaundry}
        onHide={() => setFormCreateLaundry(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">
            Tambah Cucian : Antrian {laundryRoom?.laundryQueueId}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FromCreateLaundryItem
            laundryQueueId={laundryRoom?.laundryQueueId}
            onCloseForm={() => setFormCreateLaundry(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const headers = { Cookie: cookies, 'User-Agent': userAgent };
  try {
    const userAuth = await getSessionService({
      headers,
    });

    if (!userAuth) return uNotAuthRedirect(`/login?redirect=${ctx.req.url}`);

    const laundryRoomId = ctx.params?.laundryRoomId;

    if (!laundryRoomId) {
      return {
        redirect: {
          destination: '/room',
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
          destination: '/room',
          permanent: false,
        },
      };
    }

    return {
      props: {
        userAuth,
        laundryRoom,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const { name: errName, statusCode } = err;
    if ((errName as string)?.includes('NOT_AUTH') || statusCode === 403) {
      return uNotAuthRedirect(`/login?redirect=${ctx.req.url}`);
    }
    if (statusCode === 404) {
      return {
        notFound: true,
      };
    }
    return {
      props: { errorCode: statusCode, userAuth: null },
    };
  }
}

DetailRoomPage.providers = [LaundryRoomDetailProvider];

DetailRoomPage.layout = AdminLayout;
