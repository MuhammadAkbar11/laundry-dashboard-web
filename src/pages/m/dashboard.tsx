/* eslint-disable no-new */
import React from 'react';
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
import { IMemberAuth, IMemberPageProps } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillAlt, faTshirt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const dummyData = {
  totalLaundry: 5,
  totalTransaction: 12,
  points: 30,
  laundryQueueData: [
    {
      queueNumber: 'Q001',
      status: 'Sedang Dalam Proses',
      deliveryDate: '2023-07-30',
      deliveryAddress: 'Jl. Contoh No. 123, Kota Contoh',
      totalPayment: 75000,
    },
    {
      queueNumber: 'Q002',
      status: 'Selesai',
      deliveryDate: '2023-07-28',
      deliveryAddress: 'Jl. Dummy No. 456, Kota Dummy',
      totalPayment: 50000,
    },
    {
      queueNumber: 'Q003',
      status: 'Menunggu Pembayaran',
      deliveryDate: '2023-07-29',
      deliveryAddress: 'Jl. Testing No. 789, Kota Testing',
      totalPayment: 90000,
    },
  ],
};

type PageProps = IMemberPageProps;

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: IconProp;
}

function StatisticCard({ title, value, icon }: StatisticCardProps) {
  return (
    <Card className="shadow-none border border-slate ">
      <Card.Body>
        <Row>
          <Col className=" mt-0">
            <Card.Title as="h5">{title}</Card.Title>
          </Col>
          <Col xs="auto" className="col-auto">
            <div className="stat">
              <FontAwesomeIcon icon={icon} size="lg" className="align-middle" />
            </div>
          </Col>
        </Row>
        <h1 className="mt-1 fw-bold text-dark  ">{value}</h1>
      </Card.Body>
    </Card>
  );
}

export default function MemberDashboard({ memberAuth }: PageProps) {
  const TITLE = `Dashboard | ${APP_NAME}`;
  const memberAuthCtx = useMemberAuthContext();
  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  const { totalLaundry, totalTransaction, points, laundryQueueData } =
    dummyData;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Dashboard" />
      <Container>
        <Row>
          <Col md={4}>
            <StatisticCard
              title="Total Cucian"
              value={totalLaundry}
              icon={faTshirt}
            />
          </Col>
          <Col md={4}>
            <StatisticCard
              title="Total Transaksi"
              value={totalTransaction}
              icon={faMoneyBillAlt}
            />
          </Col>
          <Col md={4}>
            <StatisticCard
              title="Poin Anda"
              value={`${points} Poin`}
              icon={faMoneyBillAlt}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <Card className=" shadow-none border ">
              <Card.Body>
                <Card.Title>Antrian</Card.Title>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nomor Antrian</th>
                      <th>Status</th>
                      <th>Tanggal Pengiriman</th>
                      <th>Alamat Pengiriman</th>
                      <th>Total Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laundryQueueData.map((queue, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{queue.queueNumber}</td>
                        <td>{queue.status}</td>
                        <td>{queue.deliveryDate}</td>
                        <td>{queue.deliveryAddress}</td>
                        <td>{uRupiah(queue.totalPayment)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
