/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from '@layouts/AdminLayout';
import { Card, Col, Container, Row, Form, Spinner } from 'react-bootstrap';
import CardChartsLine from '@components/Cards/CardChartsLine';
import CardChartsBar from '@components/Cards/CardChartsBar';
import CardChartsPie from '@components/Cards/CardChartsPie';
import CardStats from '@components/Cards/CardStats';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import LQPayStatusBadge from '@components/Badges/LQPayStatusBadge';
import AdminQuickActions from '@features/dashboard/AdminQuickActions';
import AdminStatusOverview from '@features/dashboard/AdminStatusOverview';
import AdminRecentOrders from '@features/dashboard/AdminRecentOrders';
import AdminRecentMembers from '@features/dashboard/AdminRecentMembers';
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
import {
  getAdminDashboardService,
  getRevenueAnalyticsService,
  getFinancialAnalyticsService,
  getRevenueByServiceService,
} from '@services/dashboardService';

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
  financialAnalytics: {
    labels: string[];
    revenue: number[];
    expenses: number[];
    period: string;
  };
  revenueByService: {
    labels: string[];
    data: number[];
  };
  recentOrders: RecentOrder[];
  recentMembers: RecentMember[];
}

const PERIOD_OPTIONS = [
  { value: '7', label: '7 Hari Terakhir' },
  { value: '30', label: '30 Hari Terakhir' },
  { value: '365', label: '12 Bulan Terakhir' },
];

function periodLabel(prefix: string, p: string): string {
  if (p === '365') return `${prefix} 12 Bulan Terakhir`;
  if (p === '30') return `${prefix} 30 Hari Terakhir`;
  return `${prefix} 7 Hari Terakhir`;
}

function PeriodSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <Form.Select
      className="w-auto bg-light"
      size="sm"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {PERIOD_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Form.Select>
  );
}

PeriodSelect.defaultProps = {
  disabled: false,
};

// Per-chart period state. Adopts the initial dashboard payload until the user
// picks a period, then fetches that chart's own endpoint independently.
function usePeriodSeries<T>(
  initial: T | undefined,
  fetcher: (period: string) => Promise<T>
) {
  const [period, setPeriod] = useState('7');
  const [series, setSeries] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    if (!touched.current) setSeries(initial);
  }, [initial]);

  const onChange = useCallback(
    async (p: string) => {
      touched.current = true;
      setPeriod(p);
      setLoading(true);
      try {
        setSeries(await fetcher(p));
      } catch {
        setSeries(undefined);
      } finally {
        setLoading(false);
      }
    },
    [fetcher]
  );

  return { period, series, loading, onChange };
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getAdminDashboardService('7'));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpi = data?.kpi;

  const pendingPayments =
    data?.paymentStatusSummary?.find((s) => s.status === 'PENDING')?.count || 0;

  // Each analytics chart owns its own period selector + fetch.
  const rev = usePeriodSeries(
    data?.revenueAnalytics,
    getRevenueAnalyticsService
  );
  const fin = usePeriodSeries(
    data?.financialAnalytics,
    getFinancialAnalyticsService
  );
  const svc = usePeriodSeries(
    data?.revenueByService,
    getRevenueByServiceService
  );

  return (
    <Container fluid className="admin-dashboard p-0">
      <div className="mb-3">
        <h1 className="h3 mb-1">Dashboard</h1>
        <p className="text-muted mb-0 border-bottom pb-1">
          Ringkasan bisnis dan operasional
        </p>
      </div>

      <section className="mb-4">
        <AdminQuickActions />
      </section>

      <section className="mb-4">
        <Row xs={1} sm={2} lg={3} xxl={5} className="g-3">
          <Col>
            <CardStats
              statTitle="Pendapatan Hari Ini"
              statValue={uRupiah(kpi?.revenueToday || 0)}
              statIcon="DollarSign"
              statIconColor="success"
              statPercent=""
              statDescription=""
              loading={loading}
            />
          </Col>
          <Col>
            <CardStats
              statTitle="Pendapatan Bulan Ini"
              statValue={uRupiah(kpi?.revenueThisMonth || 0)}
              statIcon="TrendingUp"
              statIconColor="success"
              statPercent=""
              statDescription=""
              loading={loading}
            />
          </Col>
          <Col>
            <CardStats
              statTitle="Cucian Aktif"
              statValue={`${kpi?.activeOrders || 0}`}
              statIcon="ShoppingCart"
              statIconColor="primary"
              statPercent=""
              statDescription=""
              loading={loading}
            />
          </Col>
          <Col>
            <CardStats
              statTitle="Pembayaran Tertunda"
              statValue={`${pendingPayments}`}
              statIcon="Clock"
              statIconColor="warning"
              statPercent=""
              statDescription=""
              loading={loading}
            />
          </Col>
          <Col>
            <CardStats
              statTitle="Anggota Baru"
              statValue={`${kpi?.newMembersThisMonth || 0}`}
              statIcon="Users"
              statIconColor="primary"
              statPercent=""
              statDescription="Bulan ini"
              loading={loading}
            />
          </Col>
        </Row>
      </section>
      <section className="mb-4">
        <h2 className="h5 text-muted mb-3 border-bottom pb-1">Analitik</h2>
        <Row className="g-3">
          <Col xl={8}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between border-bottom align-items-center flex-wrap bg-light gap-2">
                <Row className="w-100">
                  <Col>
                    <Card.Title className="mb-0">
                      {periodLabel('Pendapatan', rev.period)}
                    </Card.Title>
                  </Col>
                  <Col className="d-flex px-0 justify-content-end align-items-center">
                    <PeriodSelect
                      value={rev.period}
                      onChange={rev.onChange}
                      disabled={loading}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {loading || rev.loading ? (
                  <div
                    style={{ height: 225 }}
                    className="d-flex align-items-center flex-column justify-content-center text-muted gap-2"
                  >
                    <Spinner animation="border" /> <span>Memuat grafik...</span>
                  </div>
                ) : (
                  <CardChartsLine
                    labels={rev.series?.labels || []}
                    data={rev.series?.data || []}
                    title=""
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4}>
            <CardDatePicker />
          </Col>
        </Row>
        <Row className="mt-3 g-3">
          <Col xl={7}>
            <CardChartsBar
              title="Pendapatan vs Pengeluaran"
              labels={fin.series?.labels || []}
              revenue={fin.series?.revenue || []}
              expenses={fin.series?.expenses || []}
              loading={loading || fin.loading}
              headerRight={
                <PeriodSelect
                  value={fin.period}
                  onChange={fin.onChange}
                  disabled={loading}
                />
              }
            />
          </Col>
          <Col xl={5}>
            <CardChartsPie
              title="Komposisi Pendapatan per Layanan"
              labels={svc.series?.labels || []}
              data={svc.series?.data || []}
              toRupiah
              loading={loading || svc.loading}
              headerRight={
                <PeriodSelect
                  value={svc.period}
                  onChange={svc.onChange}
                  disabled={loading}
                />
              }
            />
          </Col>
        </Row>
      </section>
      <section className="mb-4">
        <h2 className="h5 text-muted mb-3 border-bottom pb-1">
          Status Operasional
        </h2>
        <Row className="g-3">
          <Col lg={6}>
            <AdminStatusOverview
              title="Status Cucian"
              items={data?.laundryStatusSummary}
              loading={loading}
              emptyTitle="Belum ada data cucian"
              renderBadge={(status) => <LQStatusBadge value={status} />}
            />
          </Col>
          <Col lg={6}>
            <AdminStatusOverview
              title="Status Pembayaran"
              items={data?.paymentStatusSummary}
              loading={loading}
              emptyTitle="Belum ada data pembayaran"
              renderBadge={(status) => <LQPayStatusBadge value={status} />}
            />
          </Col>
        </Row>
      </section>

      <section className="mb-4">
        <h2 className="h5 text-muted mb-3 border-bottom pb-1">
          Aktivitas Terbaru
        </h2>
        <Row className="g-3">
          <Col xl={7}>
            <AdminRecentOrders orders={data?.recentOrders} loading={loading} />
          </Col>
          <Col xl={5}>
            <AdminRecentMembers
              members={data?.recentMembers}
              loading={loading}
            />
          </Col>
        </Row>
      </section>
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
