/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from '@layouts/AdminLayout';
import {
  Card,
  Col,
  Container,
  Row,
  Table,
  Badge,
  Form,
  Spinner,
} from 'react-bootstrap';
import CardChartsLine from '@components/Cards/CardChartsLine';
import CardChartsPie from '@components/Cards/CardChartsPie';
import CardStats from '@components/Cards/CardStats';
import { GetServerSidePropsContext } from 'next';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { IUserAuth } from '@utils/interfaces';
import { getSessionService } from '@services/authSevices';
import { getAdminDashboardService } from '@services/dashboardService';

const CardDatePicker = dynamic(
  () => import('@components/Cards/CardDatePicker'),
  { ssr: false }
);

interface StatusSummary {
  status: string;
  count: number;
}

interface RecentOrder {
  orderNumber: string;
  customerName: string | null;
  status: string;
  createdAt: string;
  total: number;
}

interface RecentMember {
  memberId: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
}

interface DashboardData {
  kpi: {
    revenueToday: number;
    revenueThisMonth: number;
    activeOrders: number;
    finishedOrdersToday: number;
    newMembersThisMonth: number;
  };
  laundryStatusSummary: StatusSummary[];
  paymentStatusSummary: StatusSummary[];
  revenueAnalytics: {
    labels: string[];
    data: number[];
    period: string;
  };
  recentOrders: RecentOrder[];
  recentMembers: RecentMember[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ffc107',
  ONHOLD: '#0dcaf0',
  WASHED: '#0d6efd',
  FINISHED: '#198754',
  CANCELED: '#dc3545',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: '#ffc107',
  PROCESSED: '#0d6efd',
  REJECTED: '#dc3545',
  FINISHED: '#198754',
};

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Menunggu',
    ONHOLD: 'Ditahan',
    WASHED: 'Dicuci',
    FINISHED: 'Selesai',
    CANCELED: 'Dibatalkan',
    PROCESSED: 'Diproses',
    REJECTED: 'Ditolak',
  };
  return map[status] || status;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  const fetchData = useCallback(async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await getAdminDashboardService(selectedPeriod);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [fetchData, period]);

  const kpi = data?.kpi;
  const revenue = data?.revenueAnalytics;

  const revenueChartLabels = revenue?.labels || [];
  const revenueChartData = revenue?.data || [];

  const laundryPieLabels =
    data?.laundryStatusSummary?.map((s) => translateStatus(s.status)) || [];
  const laundryPieData = data?.laundryStatusSummary?.map((s) => s.count) || [];
  const laundryPieColors =
    data?.laundryStatusSummary?.map(
      (s) => STATUS_COLORS[s.status] || '#6c757d'
    ) || [];

  const paymentPieLabels =
    data?.paymentStatusSummary?.map((s) => translateStatus(s.status)) || [];
  const paymentPieData = data?.paymentStatusSummary?.map((s) => s.count) || [];
  const paymentPieColors =
    data?.paymentStatusSummary?.map(
      (s) => PAYMENT_STATUS_COLORS[s.status] || '#6c757d'
    ) || [];

  const periodOptions = [
    { value: '7', label: '7 Hari Terakhir' },
    { value: '30', label: '30 Hari Terakhir' },
    { value: '365', label: '12 Bulan Terakhir' },
  ];

  return (
    <Container fluid className="p-0">
      <h1 className="h3">Dashboard</h1>
      <Row className="g-3">
        <Col sm={6} lg={3}>
          <CardStats
            statTitle="Pendapatan Hari Ini"
            statValue={loading ? '...' : uRupiah(kpi?.revenueToday || 0)}
            statIcon="DollarSign"
            statPercent=""
            statPercentColor="success"
            statDescription=""
          />
        </Col>
        <Col sm={6} lg={3}>
          <CardStats
            statTitle="Pendapatan Bulan Ini"
            statValue={loading ? '...' : uRupiah(kpi?.revenueThisMonth || 0)}
            statIcon="TrendingUp"
            statPercent=""
            statPercentColor="success"
            statDescription=""
          />
        </Col>
        <Col sm={6} lg={3}>
          <CardStats
            statTitle="Cucian Aktif"
            statValue={loading ? '...' : `${kpi?.activeOrders || 0}`}
            statIcon="ShoppingCart"
            statPercent=""
            statPercentColor="success"
            statDescription=""
          />
        </Col>
        <Col sm={6} lg={3}>
          <CardStats
            statTitle="Anggota Baru"
            statValue={loading ? '...' : `${kpi?.newMembersThisMonth || 0}`}
            statIcon="Users"
            statPercent=""
            statPercentColor="success"
            statDescription="Bulan ini"
          />
        </Col>
      </Row>
      <Row className=" g-3">
        <Col xl={12}>
          <Card>
            <Card.Header className=" d-flex justify-content-between border-bottom align-items-center flex-wrap bg-light ">
              <Card.Title className="mb-0">
                {period === '365'
                  ? 'Pendapatan 12 Bulan Terakhir'
                  : period === '30'
                  ? 'Pendapatan 30 Hari Terakhir'
                  : 'Pendapatan 7 Hari Terakhir'}
              </Card.Title>
              <Form.Select
                className="w-auto"
                size="sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {periodOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Card.Header>
            <Card.Body>
              <div>
                {loading ? (
                  <div
                    style={{ height: 200 }}
                    className="d-flex align-items-center flex-column justify-content-center text-muted gap-2"
                  >
                    <Spinner animation="border" /> <span>Memuat grafik...</span>{' '}
                  </div>
                ) : (
                  <CardChartsLine
                    labels={revenueChartLabels}
                    data={revenueChartData}
                    title=""
                  />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={5}>
          <CardDatePicker />
        </Col>
        <Col xs={12} md={7}>
          <Card>
            <Card.Body>
              <Card.Title>Anggota Terbaru</Card.Title>
              <div>
                <Table striped hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Tanggal Daftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4}>Memuat...</td>
                      </tr>
                    ) : (
                      data?.recentMembers?.map((member) => (
                        <tr key={member.memberId}>
                          <td className="text-nowrap">{member.username}</td>
                          <td>{member.email}</td>
                          <td>
                            <Badge
                              bg={
                                member.status === 'ACTIVE'
                                  ? 'success'
                                  : 'warning'
                              }
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td>
                            {new Date(member.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3 g-3">
        <Col md={6}>
          {loading ? (
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                Memuat...
              </Card.Body>
            </Card>
          ) : (
            <CardChartsPie
              title="Distribusi Status Cucian"
              labels={laundryPieLabels}
              data={laundryPieData}
              colors={laundryPieColors}
            />
          )}
        </Col>
        <Col md={6}>
          {loading ? (
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                Memuat...
              </Card.Body>
            </Card>
          ) : (
            <CardChartsPie
              title="Distribusi Status Pembayaran"
              labels={paymentPieLabels}
              data={paymentPieData}
              colors={paymentPieColors}
            />
          )}
        </Col>
      </Row>

      <Row className="mt-3 g-3">
        <Col xs={12} lg={12}>
          <Card>
            <Card.Body>
              <Card.Title>Laundry Terbaru</Card.Title>
              <div>
                <Table striped hover responsive size="lg">
                  <thead>
                    <tr>
                      <th>No Laundry</th>
                      <th>Pelanggan</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4}>Memuat...</td>
                      </tr>
                    ) : (
                      data?.recentOrders?.map((order) => (
                        <tr key={order.orderNumber}>
                          <td>{order.orderNumber}</td>
                          <td className="text-nowrap">
                            {order.customerName || '-'}
                          </td>
                          <td>
                            <Badge
                              bg={
                                order.status === 'FINISHED'
                                  ? 'success'
                                  : order.status === 'CANCELED'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {translateStatus(order.status)}
                            </Badge>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const url = uReplaceURL(ctx.req.url as string);
  try {
    const userAuth = (await getSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    })) as IUserAuth;
    if (!userAuth) return uNotAuthRedirect(url);

    const hasPermission = await uCheckPermissions(userAuth, url as string);

    return {
      props: {
        userAuth,
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

Home.layout = AdminLayout;
