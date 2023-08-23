/* eslint-disable no-nested-ternary */
/* eslint-disable no-new */
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, Col, Container, Offcanvas, Row, Table } from 'react-bootstrap';
import * as Interfaces from '@interfaces';
import { APP_NAME } from '@configs/varsConfig';
import { getSessionService } from '@services/authSevices';
import {
  uCheckPermissions,
  uDate,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps } from '@utils/interfaces';
import { getDetailLaundryRoomService } from '@services/laundryRoomService';
import {
  LaundryRoomDetailProvider,
  useLaundryRoomDetailContext,
} from '@utils/context/Laundry/LaundryRoom/LaundryRoomDetailContext';
import TableRowInfo from '@components/Utils/TableRowInfo';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import BoxButton from '@components/Buttons/BoxButton';
import useGetLaundryQueueLaundries from '@hooks/useGetLaundryQueueLaundries';
import FormActionLaundryItem from '@components/Forms/FormLaundryItem/FormActionLaundryItem';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import FormFinishedLaundryRoom from '@components/Forms/FormLaundryRoom/FormFinishedLaundryRoom';
import {
  LaundryItemDeleteProvider,
  useLaundryItemDeleteContext,
} from '@utils/context/Laundry/LaundryItemDeleteContext';
import ModalConfirmDeleteLaundryItem from '@components/Modals/ModalConfirmDeleteLaundryItem';

interface Props extends IPageProps {
  laundryRoom: Interfaces.ILaundryRoom;
}

export default function DetailRoomPage(props: Props) {
  const TITLE = `Ruangan Laundry | ${APP_NAME}`;

  const { userAuth, laundryRoom: laundryRoomDefaultData } = props;

  const [formActionLaundryItem, setFormActionLaundryItem] =
    React.useState<boolean>(false);
  const [formActionTypeLaundryItem, setFormActionTypeLaundryItem] =
    React.useState<'create' | 'update'>('create');
  const [selectedLaundryItem, setSelectedLaundryItem] =
    React.useState<Interfaces.ILaundryItem | null>(null);

  const notif = useNotification();
  const router = useRouter();
  const laundryRoomIdParam = router.query?.laundryRoomId;

  const userAuthCtx = useUserAuthContext();
  const deleteLaundryItemCtx = useLaundryItemDeleteContext();
  const laundryRoomCtx = useLaundryRoomDetailContext();

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

  const laundriesSumTotalPrice = laundriesDataQuery?.data
    ? laundriesDataQuery?.data?.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.totalPrice),
        0
      )
    : 0;
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
        <Row>
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
                      label="Total Harga"
                      value={<span>{uRupiah(laundryRoom?.total)}</span>}
                    />
                  </tbody>
                </Table>
                {laundriesLength &&
                laundriesLength >= 1 &&
                laundriesSumTotalPrice !== 0 ? (
                  <FormFinishedLaundryRoom
                    laundryRoom={laundryRoom}
                    laundryRoomQueryKey={laundryRoomQueryKey}
                    laundriesLength={(laundriesLength as number) || 0}
                  />
                ) : null}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={7}>
            <Card>
              <Card.Header className=" pt-4 d-flex justify-content-between ">
                <Card.Title className=" mb-0">Daftar Item Cucian</Card.Title>
                {laundryRoom?.status !== 'FINISHED' ? (
                  <BoxButton
                    icon="Plus"
                    disabled={
                      laundryRoom?.laundryQueue.queuePaymentStatus ===
                        'FINISHED' || laundryRoomCtx.isLoading
                    }
                    onClick={() => {
                      setFormActionLaundryItem(true);
                      setFormActionTypeLaundryItem('create');
                    }}
                  >
                    Tambah Cucian
                  </BoxButton>
                ) : null}
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
                                          disabled={
                                            laundryRoom?.status ===
                                              'FINISHED' ||
                                            deleteLaundryItemCtx.isLoading
                                          }
                                          size="sm"
                                          variant="blue"
                                          icon="Edit2"
                                          className="p-1"
                                          iconSize={11}
                                          onClick={() => {
                                            setFormActionLaundryItem(true);
                                            setFormActionTypeLaundryItem(
                                              'update'
                                            );
                                            setSelectedLaundryItem(lnd);
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <BoxButton
                                          size="sm"
                                          disabled={
                                            laundryRoom?.status ===
                                              'FINISHED' ||
                                            deleteLaundryItemCtx.isLoading
                                          }
                                          iconSize={11}
                                          variant="danger"
                                          icon="Trash"
                                          className="p-1"
                                          onClick={() => {
                                            deleteLaundryItemCtx.onOpenModal({
                                              laundryItem: lnd,
                                              fetchQueryKey:
                                                laundryRoomQueryKey,
                                            });
                                          }}
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
        show={formActionLaundryItem}
        onHide={() => {
          setFormActionLaundryItem(false);
          setTimeout(() => {
            setFormActionTypeLaundryItem('create');
          }, 500);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">
            {formActionTypeLaundryItem === 'create'
              ? `Tambah Cucian : Antrian ${laundryRoom?.laundryQueueId}`
              : `Ubah Cucia ${selectedLaundryItem?.laundryId}`}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FormActionLaundryItem
            laundryQueueId={laundryRoom?.laundryQueueId}
            type={formActionTypeLaundryItem}
            laundryItem={selectedLaundryItem}
            onCloseForm={() => {
              setFormActionTypeLaundryItem('create');
              setFormActionLaundryItem(false);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <ModalConfirmDeleteLaundryItem />
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const laundryRoomId = ctx.params?.laundryRoomId;

  const headers = { Cookie: cookies, 'User-Agent': userAgent };

  const url = uReplaceURL(ctx.req.url as string);
  try {
    const userAuth = (await getSessionService({
      headers,
    })) as Interfaces.IUserAuth;
    if (!userAuth) return uNotAuthRedirect(url);

    const hasPermission = await uCheckPermissions(userAuth, url as string);

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
  LaundryItemDeleteProvider,
];

DetailRoomPage.layout = AdminLayout;
