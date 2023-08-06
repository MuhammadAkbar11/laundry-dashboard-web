/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { Card, Col, Container, Row } from 'react-bootstrap';
import FormMemberSignIn from '@components/Web/Forms/FormMemberSignIn';
import { GetServerSidePropsContext } from 'next';
import { isAuthenticadedMemberService } from '@services/authMemberService';
import { uIsAuthRedirect } from '@utils/utils';

export default function LoginPage() {
  const TITLE = `Login | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Login"
        size="sm"
        history={[{ name: 'Login', disabled: true }]}
      />
      <div className="container-fluid  bg-white font-opensans py-5">
        <Container>
          <Row>
            <Col sm={10} md={7} lg={5} className=" mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2 text-accent1 text-uppercase fw-bold ">
                    Login
                  </h1>
                </div>
                <Card className="shadow-none  ">
                  <Card.Body className="py-0 ">
                    <div className="my-sm-4">
                      <FormMemberSignIn />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  try {
    const isAuth = await isAuthenticadedMemberService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    });
    if (isAuth) return uIsAuthRedirect('/');

    return {
      props: { errorCode: null },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.statusCode === 500) {
      return {
        props: { errorCode: error?.statusCode, memberAuth: null },
      };
    }
    return {
      props: { errorCode: null },
    };
  }
}

LoginPage.layout = WebLayout;
