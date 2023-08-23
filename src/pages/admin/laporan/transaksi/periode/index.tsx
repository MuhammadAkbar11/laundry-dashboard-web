/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { APP_NAME } from '@configs/varsConfig';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { IPageProps, IUserAuth } from '@interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import TableReportTrxPeriod from '@components/Tables/Report/TableReportTrxPeriod';
// import TableReportTrx from '@components/Tables/Report/TableReportTrx';

interface Props extends IPageProps {}

export default function LaporanTransaksiFullDate({ userAuth }: Props) {
  const router = useRouter();
  const startDateQuery = router.query?.startDate as string;
  const endDateQuery = router.query?.endDate as string;

  const startDate = new Date(startDateQuery);
  const endDate = new Date(endDateQuery);
  // console.log(router.query);

  const userAuthCtx = useUserAuthContext();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  if (
    startDate?.toString().toLocaleLowerCase().includes('invalid') ||
    endDate?.toString().toLocaleLowerCase().includes('invalid')
  ) {
    return (
      <>
        <Head>
          <title>Format Tanggal Tidak Sesuai</title>
        </Head>
        <Container fluid className="p-0">
          <Alert variant="danger">Format Tanggal Tidak Sesuai</Alert>
        </Container>
      </>
    );
  }
  const startDateFormat = format(startDate, 'dd MMMM yyyy', {
    locale: id,
  });
  const endDateFormat = format(endDate, 'dd MMMM yyyy', {
    locale: id,
  });
  const date = `${startDateFormat} - ${endDateFormat}`;

  // const date = `NULL`;
  const TITLE = `Laporan Transaksi Periode: ${date} | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Laporan Transaksi Periode: {date}</h1>
        <Row className="row">
          <Col xs={12}>
            {/* <TableReportTransaction typeQueryKey="transactions" /> */}
            {/* {year && month && day ? (
              <TableReportTrx month={month} year={year} day={day} date={date} />
            ) : null} */}
            <TableReportTrxPeriod
              startDate={startDate}
              endDate={endDate}
              dateStr={date}
            />
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

LaporanTransaksiFullDate.layout = AdminLayout;
