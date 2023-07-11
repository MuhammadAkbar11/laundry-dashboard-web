/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import CardProfile from '@components/Cards/CardProfile';
import CardProfileActivities from '@components/Cards/CardProfileActivities';
import Head from 'next/head';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps, IUserAuth } from '@utils/interfaces';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@/services/authSevices';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';

interface Props extends IPageProps {}

export default function PagesProfile({ userAuth }: Props) {
  const userAuthCtx = useUserAuthContext();
  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);
  return (
    <>
      <Head>
        <title>Profile | AdminKit Demo</title>
      </Head>
      <Container fluid className="p-0">
        <div className="mb-3">
          <h1 className="h3 d-inline align-middle me-1">Profile</h1>
          <Link
            className="badge bg-dark text-white ms-2"
            href="/pages/upgrade-to-pro"
          >
            Get more page examples
          </Link>
        </div>
        <Row>
          <Col md={4} xl={3}>
            <CardProfile />
          </Col>
          <Col md={8} xl={9}>
            <CardProfileActivities />
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

    return {
      props: {
        userAuth,
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

PagesProfile.layout = AdminLayout;
