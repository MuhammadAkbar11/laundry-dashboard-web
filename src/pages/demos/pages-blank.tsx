/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { GetServerSidePropsContext } from 'next';
import { IUserAuth } from '@interfaces';
import { getSessionService } from '@services/authSevices';
import { APP_NAME } from '@configs/varsConfig';

export default function PagesBlank() {
  const TITLE = `Transkasi | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Blank Page</h1>
        <Row className="row">
          <Col xs={12}>
            <Card>
              <Card.Header>
                <Card.Title className=" mb-0">Empty card</Card.Title>
              </Card.Header>
              <Card.Body>{/*  */}</Card.Body>
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
  const headers = { Cookie: cookies, 'User-Agent': userAgent };

  const url = uReplaceURL(ctx.req.url as string);
  try {
    const userAuth = (await getSessionService({
      headers,
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

PagesBlank.layout = AdminLayout;
