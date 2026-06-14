/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
import { GetServerSidePropsContext } from 'next';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { getMemberDashboardService } from '@services/dashboardService';
import { IMemberAuth, IMemberPageProps } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { Card, Col, Container, Row, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillAlt,
  faTshirt,
  faCheckCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MemberStatisticCard from '@components/Web/Cards/MemberStatisticCard';

type PageProps = IMemberPageProps;

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: IconProp;
}

export default function MemberDashboard({ memberAuth }: PageProps) {
  const TITLE = `Dashboard | ${APP_NAME}`;
  const memberAuthCtx = useMemberAuthContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  useEffect(() => {
    getMemberDashboardService()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Dashboard" />
      <Container>
        <Row>
          <Col md={3} className="mb-3">
            <MemberStatisticCard
              title="Total Cucian"
              value={loading ? '...' : summary?.totalOrders || 0}
              icon={faTshirt}
            />
          </Col>
          <Col md={3} className="mb-3">
            <MemberStatisticCard
              title="Cucian Aktif"
              value={loading ? '...' : summary?.activeOrders || 0}
              icon={faClock}
            />
          </Col>
          <Col md={3} className="mb-3">
            <MemberStatisticCard
              title="Cucian Selesai"
              value={loading ? '...' : summary?.completedOrders || 0}
              icon={faCheckCircle}
            />
          </Col>
          <Col md={3} className="mb-3">
            <MemberStatisticCard
              title="Total Pengeluaran"
              value={loading ? '...' : uRupiah(summary?.totalSpending || 0)}
              icon={faMoneyBillAlt}
            />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={6} className="mb-3 ">
            <Card className="shadow-none border h-100">
              <Card.Body>
                <Card.Title>Ringkasan Pengeluaran</Card.Title>
                <Row className="mt-3">
                  <Col xs={6}>
                    <h5 className="text-muted">Bulan Ini</h5>
                    <h3 className="fw-bold">
                      {loading
                        ? '...'
                        : uRupiah(summary?.currentMonthSpending || 0)}
                    </h3>
                  </Col>
                  <Col xs={6}>
                    <h5 className="text-muted">Total</h5>
                    <h3 className="fw-bold">
                      {loading ? '...' : uRupiah(summary?.totalSpending || 0)}
                    </h3>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3  ">
            <Card className="shadow-none border h-100">
              <Card.Body>
                <Card.Title>Cucian Terbaru</Card.Title>
                {loading ? (
                  <p>Memuat...</p>
                ) : data?.recentOrders?.length === 0 ? (
                  <p className="text-muted">Tidak ada Cucian.</p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Nomor Cucian</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.recentOrders?.map((queue: any) => (
                        <tr key={queue.orderNumber}>
                          <td>{queue.orderNumber}</td>
                          <td>
                            <Badge
                              bg={
                                queue.status === 'FINISHED'
                                  ? 'success'
                                  : queue.status === 'CANCELED'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {queue.status}
                            </Badge>
                          </td>
                          <td>
                            {new Date(queue.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={6} className="mb-3">
            <Card className="shadow-none border">
              <Card.Body>
                <Card.Title>Cucian Aktif</Card.Title>
                {loading ? (
                  <p>Memuat...</p>
                ) : data?.activeLaundryQueues?.length === 0 ? (
                  <p className="text-muted">Tidak ada Cucian aktif.</p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Nomor Cucian</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.activeLaundryQueues?.map((queue: any) => (
                        <tr key={queue.orderNumber}>
                          <td>{queue.orderNumber}</td>
                          <td>
                            <Badge
                              bg={
                                queue.status === 'FINISHED'
                                  ? 'success'
                                  : queue.status === 'CANCELED'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {queue.status}
                            </Badge>
                          </td>
                          <td>
                            {new Date(queue.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
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
  try {
    const memberAuth = (await getMemberSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    return {
      props: {
        memberAuth,
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

MemberDashboard.layout = WebMemberLayout;
