/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@/services/authSevices';
import { uNotAuthRedirect } from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps } from '@utils/interfaces';
import { LaundryQueueCreateProvider } from '@utils/context/Laundry/LaundryQueue/LaundryQueueCreateContext';
import { APP_NAME } from '@configs/varsConfig';
import { LaundryQueueDeleteProvider } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDeleteContext';
import { LaundryQueueDetailProvider } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDetailContext';
import TableLaundryRoom from '@components/Tables/Laundry/TableLaundryRoom';

interface Props extends IPageProps {}

export default function AntrianPage({ userAuth }: Props) {
  const TITLE = `Laundry Room | ${APP_NAME}`;

  const userAuthCtx = useUserAuthContext();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Laundry Room</h1>
        <Row className="row">
          <Col xs={12}>
            {/* <TableLaundryQueue /> */}
            <TableLaundryRoom />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;

  try {
    const userAuth = await getSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    });
    if (!userAuth) return uNotAuthRedirect(`/login?redirect=${ctx.req.url}`);
    return {
      props: {
        userAuth,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (
      (err?.name as string)?.includes('NOT_AUTH') ||
      err?.statusCode === 403
    ) {
      return uNotAuthRedirect(`/login?redirect=${ctx.req.url}`);
    }

    return {
      props: { errorCode: err?.statusCode, userAuth: null },
    };
  }
}

AntrianPage.providers = [
  LaundryQueueCreateProvider,
  LaundryQueueDeleteProvider,
  LaundryQueueDetailProvider,
];

AntrianPage.layout = AdminLayout;
