import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { APP_NAME } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faClipboardList,
  faBagShopping,
  faReceipt,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { getMemberLaundryRoomDetailService } from '@services/memberService';
import { IMemberAuth, IMemberPageProps, ILaundryRoom } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import EmptyState from '@components/Web/EmptyState/EmptyState';
import OrderReferenceCard from '@features/order/OrderReferenceCard';
import OrderSummaryCard from '@features/order/OrderSummaryCard';
import OrderNextSteps from '@features/order/OrderNextSteps';

type PageProps = IMemberPageProps & {
  room: ILaundryRoom | null;
  laundryQueueId: string | null;
};

export default function OrderSuccesPage({
  memberAuth,
  room,
  laundryQueueId,
}: PageProps) {
  const TITLE = `Pemesanan Berhasil | ${APP_NAME}`;
  const memberAuthCtx = useMemberAuthContext();

  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Pemesanan Berhasil" />
      <Container className="pb-5">
        <Card className="order-success-hero border-0 text-center mb-4">
          <Card.Body className="py-4">
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="4x"
              className="text-success mb-3"
            />
            <h2 className="fw-bolder mb-1">Pesanan Berhasil Dibuat</h2>
            <p className="text-muted mb-0">
              Pesanan Anda telah masuk ke antrian dan akan segera diproses.
              Mohon tunggu konfirmasi lebih lanjut.
            </p>
          </Card.Body>
        </Card>

        {laundryQueueId ? (
          <>
            <Row className="justify-content-center mb-4">
              <Col xs={12} md={8} lg={6}>
                <OrderReferenceCard orderNumber={laundryQueueId} />
              </Col>
            </Row>

            <Row className="g-3 mb-4">
              <Col xs={12} lg={6}>
                {room ? (
                  <OrderSummaryCard room={room} />
                ) : (
                  <Card className="shadow-none border h-100">
                    <Card.Body>
                      <EmptyState
                        title="Detail pesanan belum tersedia"
                        description="Anda tetap dapat melihat pesanan melalui menu Antrian atau Cucian."
                        icon={faClipboardList}
                      />
                    </Card.Body>
                  </Card>
                )}
              </Col>
              <Col xs={12} lg={6}>
                <OrderNextSteps
                  status={room?.laundryQueue?.status}
                  deliveryType={room?.laundryQueue?.deliveryType}
                  deliveredAt={room?.laundryQueue?.deliveryAt}
                />
              </Col>
            </Row>
          </>
        ) : (
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={8}>
              <Card className="shadow-none border">
                <Card.Body>
                  <EmptyState
                    title="Data pesanan tidak ditemukan"
                    description="Silakan periksa pesanan Anda melalui menu Antrian atau Dashboard."
                    icon={faClipboardList}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="g-2 justify-content-center">
          {room ? (
            <Col xs={6} md="auto">
              <Link
                href={`/m/cucian/${laundryQueueId}`}
                className="text-decoration-none"
              >
                <Button variant="accent1" className="w-100 rounded-pill px-4">
                  <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                  Lihat Detail
                </Button>
              </Link>
            </Col>
          ) : null}
          <Col xs={6} md="auto">
            <Link href="/m/antrian" className="text-decoration-none">
              <Button
                variant="outline-accent1"
                className="w-100 rounded-pill px-4"
              >
                <FontAwesomeIcon icon={faBagShopping} className="me-2" />
                Antrian
              </Button>
            </Link>
          </Col>
          <Col xs={6} md="auto">
            <Link href="/m/transaksi" className="text-decoration-none">
              <Button
                variant="outline-accent1"
                className="w-100 rounded-pill px-4"
              >
                <FontAwesomeIcon icon={faReceipt} className="me-2" />
                Transaksi
              </Button>
            </Link>
          </Col>
          <Col xs={6} md="auto">
            <Link href="/m/dashboard" className="text-decoration-none">
              <Button
                variant="outline-accent1"
                className="w-100 rounded-pill px-4"
              >
                <FontAwesomeIcon icon={faChartBar} className="me-2" />
                Dashboard
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const url = uReplaceURL(ctx.req.url as string);
  const headers = { Cookie: cookies, 'User-Agent': userAgent };
  const laundryQueueId = (ctx.query?.laundryQueue as string) || null;

  try {
    const memberAuth = (await getMemberSessionService({
      headers,
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    let room: ILaundryRoom | null = null;
    if (laundryQueueId) {
      try {
        room =
          ((await getMemberLaundryRoomDetailService(laundryQueueId, {
            headers,
          })) as ILaundryRoom) || null;
      } catch {
        room = null;
      }
    }

    return {
      props: {
        memberAuth,
        room,
        laundryQueueId,
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
        room: null,
        laundryQueueId: null,
      },
    };
  }
}

OrderSuccesPage.layout = WebMemberLayout;
