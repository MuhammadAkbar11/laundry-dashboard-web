/* eslint-disable no-nested-ternary */
/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { APP_NAME, LAUNDRY_ROOM_STATUS } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
import {
  uDate,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { IMemberAuth, ILaundryRoom, ILaundryItem } from '@interfaces';

import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { useRouter } from 'next/router';
import useNotification from '@hooks/useNotification';
import { getMemberLaundryRoomDetailService } from '@services/memberService';
import { useQuery } from '@tanstack/react-query';
import useGetMemberLaundryQueueLaundries from '@hooks/useGetMemberLaundryQueueLaundries';
import {
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
  Table,
  Button,
} from 'react-bootstrap';
import TableRowInfo from '@components/Utils/TableRowInfo';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import PaymentStatusText from '@components/Typography/PaymentStatusText';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';

type Props = {
  laundryRoom: ILaundryRoom;
};

export default function MemberDetailLaundryPage({
  laundryRoom: laundryRoomInitData,
}: Props) {
  const notif = useNotification();
  const router = useRouter();

  const laundryQueueIdParam = router.query?.laundryQueueId;

  const laundryRoomQueryKey = React.useMemo(
    () => ['laundryRoomDetail', { laundryQueueId: laundryQueueIdParam }],
    [laundryQueueIdParam]
  );

  const { data: laundryRoom } = useQuery<unknown, unknown, ILaundryRoom>({
    queryKey: laundryRoomQueryKey,
    queryFn: () =>
      getMemberLaundryRoomDetailService(laundryQueueIdParam as string),
    initialData: laundryRoomInitData,
  });

  const { laundryQueue } = laundryRoom;
  const customerData = laundryQueue.customer;

  const laundriesDataQuery = useGetMemberLaundryQueueLaundries(
    laundryQueueIdParam as string
  );

  React.useEffect(() => {
    if (laundriesDataQuery.isError) {
      notif.danger('Gagal mengambil data cucian', {
        id: `laundriesError_${laundryQueueIdParam}`,
      });
    }
  }, [laundriesDataQuery, laundryQueueIdParam, notif]);

  const laundriesLength = laundriesDataQuery?.data?.length;

  const TITLE = `Cucian ${laundryQueueIdParam || ''} | ${APP_NAME}`;

  const hidePayBtn =
    laundriesLength === 0 ||
    laundryRoom?.status !== 'FINISHED' ||
    laundryRoom?.laundryQueue?.queuePaymentStatus === 'FINISHED' ||
    laundryRoom?.laundryQueue?.queuePaymentStatus === 'PROCESSED';

  let deliveryTypeContent = (
    <>
      <span className="me-1">Self Pickup</span>
      {laundryQueue.status === 'FINISHED' ? (
        laundryQueue?.deliveryAt === null ? (
          <span className="text-danger fst-italic ">(Belum di ambil)</span>
        ) : (
          <span className="text-success fst-italic ">(Sudah di ambil)</span>
        )
      ) : null}
    </>
  );

  if (laundryQueue?.deliveryType === 'DELIVERED') {
    deliveryTypeContent = (
      <>
        <span className="me-1">Delivery / Jemput-Antar</span>
        {laundryQueue.status === 'FINISHED' ? (
          laundryQueue?.deliveryAt === null ? (
            <span className="text-danger fst-italic ">(belum di antar)</span>
          ) : (
            <span className="text-success fst-italic ">(Sudah di antar)</span>
          )
        ) : null}
      </>
    );
  }

  const payButtonContent = !hidePayBtn ? (
    <div className="mb-2 w-100 ">
      <Link
        href={`/pembayaran/${laundryRoom?.laundryQueueId}`}
        legacyBehavior
        passHref
      >
        <Button
          className="d-flex justify-content-center align-items-center py-2 "
          variant="accent1"
          style={{ fontSize: 17 }}
        >
          <FontAwesomeIcon className="fa-fw" icon={faMoneyBill} />
          <span className="ms-1">Pembayaran</span>
        </Button>
      </Link>
    </div>
  ) : null;

  const laundriesContent = (
    <Card className="bg-light shadow-none h-100">
      <Card.Header className=" pt-4 bg-transparent">
        <Card.Title className=" mb-0 text-accent1 ">Daftar Cucian</Card.Title>
      </Card.Header>
      <Card.Body className="pt-0 ">
        <div className="table-responsive">
          <Table hover size="lg">
            <thead>
              <tr>
                <th>Jenis Layanan</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <TableLoadingRow
                isError={laundriesDataQuery?.isError}
                rows={laundriesDataQuery?.data as ILaundryItem[]}
                isLoading={laundriesDataQuery.isLoading}
                headerLength={5}
              />
              {!laundriesDataQuery.isLoading
                ? laundriesDataQuery?.data
                  ? laundriesDataQuery?.data?.map((lnd) => {
                      return (
                        <tr key={lnd.laundryId}>
                          <td>{lnd?.historyService?.name}</td>
                          <td className="text-nowrap">
                            {lnd.quantity}{' '}
                            <span style={{ textTransform: 'capitalize' }}>
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
  );

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title={`Cucian ${laundryQueueIdParam || ''}`} />
      {/* <MemberTableLaundryRoom /> */}
      <Container className="pt-3 pb-5">
        <Row className="align-content-stretch mb-4 mb-lg-0 ">
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <Card className="shadow-none bg-light my-0 h-100">
              <Card.Header className="pt-4  bg-transparent">
                <Card.Title className=" mb-0 text-accent1 ">
                  Info Cucian
                </Card.Title>
              </Card.Header>
              <Card.Body className="pt-0 ">
                <Table borderless>
                  <tbody>
                    <TableRowInfo
                      label="ID Antrian"
                      value={<span>{laundryRoom?.laundryQueueId}</span>}
                    />
                    <TableRowInfo
                      label="Waktu Cuci"
                      value={<span>{uDate(laundryRoom?.createdAt)}</span>}
                    />
                    <TableRowInfo
                      label="Waktu Selesai"
                      value={
                        <span>
                          {laundryQueue?.finishedAt
                            ? uDate(laundryQueue?.finishedAt)
                            : '-'}
                        </span>
                      }
                    />
                    <TableRowInfo
                      label="Status Cucian"
                      value={
                        <span>
                          {LAUNDRY_ROOM_STATUS[laundryRoom?.status || 'READY']}
                        </span>
                      }
                    />
                    <TableRowInfo
                      label="Total Item"
                      value={<span>{laundriesLength} Cucian</span>}
                    />
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} className="d-flex flex-column d-lg-none mt-lg-4">
            {laundriesContent}
          </Col>
          <Col xs={12} lg={6}>
            <Card className="shadow-none bg-light h-100 ">
              <Card.Header className="pt-4 bg-transparent">
                <Card.Title className=" mb-0  text-accent1 ">
                  Pengiriman & Pembayaran
                </Card.Title>
              </Card.Header>
              <Card.Body className="pt-0">
                <Table borderless>
                  <tbody>
                    <TableRowInfo
                      label="Pelanggan"
                      nowrapLabel
                      value={
                        <span>
                          {customerData?.name || '-'} ({customerData?.phone})
                        </span>
                      }
                    />
                    <TableRowInfo
                      label="Pengiriman"
                      nowrapLabel
                      value={deliveryTypeContent}
                    />
                    {laundryQueue.deliveryType === 'DELIVERED' ? (
                      <TableRowInfo
                        label="Alamat Kirim / Jemput"
                        nowrapLabel
                        value={
                          <OverlayTrigger
                            overlay={
                              <Tooltip>{laundryQueue?.deliveryAddress}</Tooltip>
                            }
                          >
                            <span className="text-truncate-1 ">
                              {laundryQueue?.deliveryAddress}
                            </span>
                          </OverlayTrigger>
                        }
                      />
                    ) : null}
                    <TableRowInfo
                      label="Status Bayar"
                      nowrapLabel
                      value={
                        laundryRoom?.status === 'FINISHED' ? (
                          <PaymentStatusText
                            className="text-nowrap"
                            value={laundryQueue.queuePaymentStatus}
                            colored
                          />
                        ) : (
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                Pembayaran di lakukan ketika proses pencuian
                                telah selesai
                              </Tooltip>
                            }
                          >
                            <span className="">Masih Proses Pencucian</span>
                          </OverlayTrigger>
                        )
                      }
                    />
                    <TableRowInfo
                      label="Total Harga"
                      value={<span>{uRupiah(laundryRoom?.total)}</span>}
                    />
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="bg-transparent  ">
                {payButtonContent}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row className="d-none d-lg-flex">
          <Col xs={12} md={12} lg={10} className=" mt-lg-4">
            {laundriesContent}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const laundryQueueId = ctx.params?.laundryQueueId;

  const headers = { Cookie: cookies, 'User-Agent': userAgent };

  const url = uReplaceURL(ctx.req.url as string);
  try {
    const memberAuth = (await getMemberSessionService({
      headers,
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    const laundryRoom = await getMemberLaundryRoomDetailService(
      laundryQueueId as string,
      { headers }
    );

    return {
      props: {
        memberAuth,
        laundryRoom,
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

MemberDetailLaundryPage.layout = WebMemberLayout;
