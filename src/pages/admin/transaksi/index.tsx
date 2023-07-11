/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';
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
  uRestrictedRedirect,
} from '@utils/utils';
import { IPageProps, IUserAuth } from '@interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import TableTransaction from '@components/Tables/TableTransaction';

interface Props extends IPageProps {}

export default function TransaksiPage({ userAuth }: Props) {
  const TITLE = `Transkasi | ${APP_NAME}`;

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
        <h1 className="h3 mb-3">Transaksi</h1>
        <Row className="row">
          <Col xs={12}>
            <TableTransaction typeQueryKey="transactions" />
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

TransaksiPage.layout = AdminLayout;
