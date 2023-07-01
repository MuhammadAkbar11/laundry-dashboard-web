/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Card, Col, Container, Offcanvas, Row } from 'react-bootstrap';
import { APP_NAME } from '@configs/varsConfig';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@services/authSevices';
import { uNotAuthRedirect } from '@utils/utils';
import { IPageProps } from '@interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import {
  LaundryServiceActionsProvider,
  useLaundryServiceActionsContext,
} from '@utils/context/Laundry/LaundryService/LaundryServiceActionsContext';
import TableLaundryService from '@components/Tables/Laundry/TableLaundryService';
import FormCreateLaundryService from '@components/Forms/FormLaundryService/FormCreateLaundryService';

interface Props extends IPageProps {}

export default function LaundryServicePage({ userAuth }: Props) {
  const TITLE = `Layanan | ${APP_NAME}`;

  const userAuthCtx = useUserAuthContext();

  const laundryServiceActionsCtx = useLaundryServiceActionsContext();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Layanan</h1>
        <Row className="row">
          <Col xs={12}>
            <TableLaundryService />
          </Col>
        </Row>
      </Container>
      <Offcanvas
        backdrop="static"
        placement="end"
        show={laundryServiceActionsCtx.isOpenForm}
        onHide={() => laundryServiceActionsCtx.onCloseForm()}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {laundryServiceActionsCtx?.formType === 'create'
              ? 'Tambah Data Layanan'
              : null}
            {laundryServiceActionsCtx?.formType === 'update'
              ? 'Ubah Data Layanan'
              : null}
            {laundryServiceActionsCtx?.formType === 'initial'
              ? 'Loading...'
              : null}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {laundryServiceActionsCtx.isOpenForm ? (
            <>
              {laundryServiceActionsCtx?.formType === 'create' ? (
                <FormCreateLaundryService />
              ) : null}
              {laundryServiceActionsCtx?.formType === 'update' ? (
                <h1>FORM UPDATE</h1>
              ) : null}
            </>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
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

LaundryServicePage.providers = [LaundryServiceActionsProvider];

LaundryServicePage.layout = AdminLayout;
