/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@layouts/AdminLayout';
import CardChartsLine from '@components/Cards/CardChartsLine';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import CardStats from '@components/Cards/CardStats';
// import CardFlatpickr from '@components/Cards/CardFlatpickr';
// import CardChartsPie from '@components/Cards/CardChartsPie';
// import CardWorldMap from '@components/Cards/CardWorldMap';
// import CardChartsBar from '@components/Cards/CardChartsBar';
// import CardProjects from '@components/Cards/CardProjects';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@/services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { IUserAuth } from '@utils/interfaces';

interface Transaction {
  id: number;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export default function Home() {
  const salesStat = 3382;
  const visitorsStat = 14212;
  const earningsStat = 21300;
  const ordersStat = 64;

  const recentTransactions: Transaction[] = [
    {
      id: 1,
      customerName: 'John Doe',
      totalAmount: 50000,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      totalAmount: 75000,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 3,
      customerName: 'Michael Johnson',
      totalAmount: 120000,
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
    },
    {
      id: 4,
      customerName: 'Anna Lee',
      totalAmount: 100000,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 5,
      customerName: 'Robert Brown',
      totalAmount: 85000,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
  ];

  return (
    <Container fluid className="p-0">
      <h1 className="h3">Dashboard</h1>
      <Row className="mt-3">
        <Col xl={6} xxl={5} className="d-flex">
          <div className="w-100">
            {/* <Row>
              <Col sm={6}>
                <CardStats
                  statTitle="Sales"
                  statValue="3.382"
                  statIcon="Truck"
                  statPercent="-3.65%"
                  statPercentColor="danger"
                  statDescription="Since last week"
                />
                <CardStats
                  statTitle="Visitors"
                  statValue="14.212"
                  statIcon="Users"
                  statPercent="5.25%"
                  statPercentColor="success"
                  statDescription="Since last week"
                />
              </Col>
              <Col sm={6}>
                <CardStats
                  statTitle="Earnings"
                  statValue="$21.300"
                  statIcon="DollarSign"
                  statPercent="6.65%"
                  statPercentColor="success"
                  statDescription="Since last week"
                />
                <CardStats
                  statTitle="Orders"
                  statValue="64"
                  statIcon="ShoppingCart"
                  statPercent="-2.25%"
                  statPercentColor="danger"
                  statDescription="Since last week"
                />
              </Col>
            </Row> */}
            <Row>
              <Col sm={6}>
                <CardStats
                  statTitle="Penjualan"
                  statValue={salesStat.toLocaleString()}
                  statIcon="Truck"
                  statPercent="-3.65%"
                  statPercentColor="danger"
                  statDescription="Sejak minggu lalu"
                />
                <CardStats
                  statTitle="Pengunjung"
                  statValue={visitorsStat.toLocaleString()}
                  statIcon="User"
                  statPercent="5.25%"
                  statPercentColor="success"
                  statDescription="Sejak minggu lalu"
                />
              </Col>
              <Col sm={6}>
                <CardStats
                  statTitle="Pendapatan"
                  statValue={earningsStat.toLocaleString()}
                  statIcon="DollarSign"
                  statPercent="6.65%"
                  statPercentColor="success"
                  statDescription="Sejak minggu lalu"
                />
                <CardStats
                  statTitle="Pesanan"
                  statValue={`${ordersStat}`}
                  statIcon="ShoppingCart"
                  statPercent="-2.25%"
                  statPercentColor="danger"
                  statDescription="Sejak minggu lalu"
                />
              </Col>
            </Row>
          </div>
        </Col>
        <div className="col-xl-6 col-xxl-7">
          <CardChartsLine />
        </div>
      </Row>
      <Row>
        {/* <Col xs={12} md={6} xxl={3} className="d-flex order-2 order-xxl-3">
          <CardChartsPie />
        </Col> */}
        {/* <Col xs={12} md={6} xxl={3} className="d-flex order-1 order-xxl-1">
          <CardFlatpickr />
        </Col> */}
        <Col xs={12} className="">
          <Card>
            <Card.Body>
              <div>
                <h3>Transaksi Terbaru</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID Transaksi</th>
                      <th>Nama Pelanggan</th>
                      <th>Total Amount</th>
                      <th>Metode Pembayaran</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{transaction.customerName}</td>
                        <td>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(transaction.totalAmount)}
                        </td>
                        <td>{transaction.paymentMethod}</td>
                        <td>{transaction.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col xl={12} md={12} xxl={6} className="d-flex order-3 order-xxl-2">

          <CardWorldMap />
        </Col> */}
      </Row>

      {/* <Row>
        <Col xs={12} lg={8} xxl={9} className=" d-flex">
          <CardProjects />
        </Col>
        <Col xs={12} lg={4} xxl={3} className="d-flex">
          <CardChartsBar />
        </Col>
      </Row> */}
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
