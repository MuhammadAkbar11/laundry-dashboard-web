/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { Card, Col, Row } from 'react-bootstrap';
import AuthLayout from '@layouts/AuthLayout';
// import Image from 'next/image';
import FormSignIn from '@components/Forms/FormSignIn';
import { GetServerSidePropsContext } from 'next';
import { isAuthenticadedService } from '@/services/authSevices';
import { uIsAuthRedirect } from '@utils/utils';

type Props = {
  // userAuth: IUserAuth;
};

export default function PagesSignIn({}: Props) {
  // console.log(userAuth);

  return (
    <>
      <Head>
        <title>Masuk | AdminKit Demo</title>
      </Head>
      <Row className=" vh-100">
        <Col sm={10} md={8} lg={6} className=" mx-auto d-table h-100">
          <div className="d-table-cell align-middle">
            <div className="text-center mt-4">
              <h1 className="h2">Selamat datang</h1>
              <p className="lead">Masuk ke akun Anda untuk melanjutkan</p>
            </div>
            <Card>
              <Card.Body>
                <div className="m-sm-4">
                  {/* <div className="text-center">
                    <Image
                      src="/img/avatars/avatar.jpg"
                      alt="Charles Hall"
                      className="img-fluid rounded-circle"
                      width={132}
                      height={132}
                      priority
                    />
                  </div> */}
                  <FormSignIn />
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const isAuth = await isAuthenticadedService({
    headers: { Cookie: cookies, 'User-Agent': userAgent },
  });
  if (isAuth) return uIsAuthRedirect();

  return {
    props: {},
  };
}

PagesSignIn.layout = AuthLayout;
