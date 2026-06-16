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
import { Card, Col, Placeholder, Row } from 'react-bootstrap';
import {
  faMoneyBillAlt,
  faTshirt,
  faCheckCircle,
  faClock,
  faBagShopping,
} from '@fortawesome/free-solid-svg-icons';
import MemberStatisticCard from '@components/Web/Cards/MemberStatisticCard';
import MemberWelcome from '@features/member/dashboard/MemberWelcome';
import MemberQuickActions from '@features/member/dashboard/MemberQuickActions';
import MemberOrderList from '@features/member/dashboard/MemberOrderList';
import MemberStatusSummary from '@features/member/dashboard/MemberStatusSummary';

type PageProps = IMemberPageProps;

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
  const activeLaundryQueues = data?.activeLaundryQueues || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Dashboard" />

      <MemberWelcome
        activeOrders={summary?.activeOrders || 0}
        loading={loading}
      />

      <MemberQuickActions />

      <Row className="mt-2">
        <Col sm={6} lg={3} className="mb-3">
          <MemberStatisticCard
            title="Total Cucian"
            value={summary?.totalOrders || 0}
            icon={faTshirt}
            loading={loading}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <MemberStatisticCard
            title="Cucian Aktif"
            value={summary?.activeOrders || 0}
            icon={faClock}
            loading={loading}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <MemberStatisticCard
            title="Cucian Selesai"
            value={summary?.completedOrders || 0}
            icon={faCheckCircle}
            loading={loading}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <MemberStatisticCard
            title="Total Pengeluaran"
            value={uRupiah(summary?.totalSpending || 0)}
            icon={faMoneyBillAlt}
            loading={loading}
          />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col lg={8} className="mb-3">
          <MemberOrderList
            title="Cucian Aktif"
            orders={activeLaundryQueues}
            loading={loading}
            emptyTitle="Tidak ada cucian aktif"
            emptyDescription="Cucian yang sedang berjalan akan muncul di sini."
            emptyIcon={faClock}
            viewAllHref="/m/cucian"
          />
        </Col>
        <Col lg={4} className="mb-3">
          <MemberStatusSummary orders={activeLaundryQueues} loading={loading} />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col lg={8} className="mb-3">
          <MemberOrderList
            title="Cucian Terbaru"
            orders={recentOrders}
            loading={loading}
            emptyTitle="Belum ada cucian"
            emptyDescription="Riwayat cucian terbaru Anda akan muncul di sini."
            emptyIcon={faBagShopping}
            viewAllHref="/m/cucian"
          />
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="shadow-none border h-100">
            <Card.Body>
              <Card.Title>Ringkasan Pengeluaran</Card.Title>
              <div className="mt-3">
                <h6 className="text-muted mb-1">Bulan Ini</h6>
                {loading ? (
                  <Placeholder as="h3" animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                ) : (
                  <h3 className="fw-bold">
                    {uRupiah(summary?.currentMonthSpending || 0)}
                  </h3>
                )}
              </div>
              <hr />
              <div>
                <h6 className="text-muted mb-1">Total Keseluruhan</h6>
                {loading ? (
                  <Placeholder as="h3" animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                ) : (
                  <h3 className="fw-bold">
                    {uRupiah(summary?.totalSpending || 0)}
                  </h3>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
