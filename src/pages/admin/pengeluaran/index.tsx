import { APP_NAME } from '@configs/varsConfig';
import { IPageProps } from '@interfaces';
import AdminLayout from '@layouts/AdminLayout';
import { getSessionService } from '@services/authSevices';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { uNotAuthRedirect } from '@utils/utils';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

interface Props extends IPageProps {}

export default function PengeluaranPage({ userAuth }: Props) {
  const TITLE = `Pengeluaran | ${APP_NAME}`;

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
        <h1 className="h3 mb-3">Data Pengeluaran</h1>
        <Row className="row">
          <Col xs={12}>
            <p>Pengeluaran</p>
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

PengeluaranPage.layout = AdminLayout;
