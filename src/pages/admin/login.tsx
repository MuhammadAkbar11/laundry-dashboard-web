/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { Card, Col, Row } from 'react-bootstrap';
import AuthLayout from '@layouts/AuthLayout';
import FormSignIn from '@components/Forms/FormSignIn';
import { GetServerSidePropsContext } from 'next';
import { isAuthenticadedService } from '@/services/authSevices';
import { uIsAuthRedirect } from '@utils/utils';
import { APP_NAME } from '@configs/varsConfig';
import { useRouter } from 'next/router';
import FeatherIcon from '@components/Icons/FeatherIcon';

type Props = {
  // userAuth: IUserAuth;
};

export default function PagesSignIn({}: Props) {
  const title = `Masuk | ${APP_NAME}`;

  const router = useRouter();
  const routerQuery = router.query;
  const routerPathname = router.pathname;

  React.useEffect(() => {
    if (routerQuery?.redirect?.includes('/_next/data')) {
      router.replace(routerPathname);
    }
  }, [routerQuery, routerPathname, router]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Row className=" vh-100">
        <Col sm={10} md={8} lg={6} className=" mx-auto d-table h-100">
          <div className="d-table-cell align-middle">
            <div className="text-center mt-4 mb-3">
              <h1 className="h2 ">Selamat datang</h1>
              {/* <p className="lead">Masuk ke akun Anda untuk melanjutkan</p> */}
            </div>
            <Card>
              <Card.Body className="pt-4">
                <Card.Title className="text-primary text-center ">
                  <FeatherIcon name="Sliders" size={30} />
                </Card.Title>
                <Card.Title className=" text-center text-dark text-uppercase ">
                  {' '}
                  <br />
                  {APP_NAME} <br /> Administrasi
                </Card.Title>
                <div className="m-sm-4">
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
  try {
    const isAuth = await isAuthenticadedService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    });
    if (isAuth) return uIsAuthRedirect();

    return {
      props: { errorCode: null },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.statusCode === 500) {
      return {
        props: { errorCode: error?.statusCode, userAuth: null },
      };
    }
    return {
      props: { errorCode: null },
    };
  }
}

PagesSignIn.layout = AuthLayout;
