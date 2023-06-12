/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import TableLaundryQueue from '@components/Tables/Laundry/TableLaundryQueue';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@/services/authSevices';
import { uNotAuthRedirect } from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps } from '@utils/interfaces';
import {
  LaundryQueueCreateProvider,
  useLaundryQueueCreateContext,
} from '@utils/context/Laundry/LaundryQueue/LaundryQueueCreateContext';
import FormCreateLaundryQueue from '@components/Forms/FormsLaundryQueue/FormCreateLaundryQueue';
import FormCreateCustomerWithLaundryQueue from '@components/Forms/FormsLaundryQueue/FormCreateCustomerWithLaundryQueue';
import { APP_NAME } from '@configs/varsConfig';
import ModalConfirmDeleteLaundryQueue from '@components/Modals/LaundryQueue/ModalConfirmDeleteLaundryQueue';
import { LaundryQueueDeleteProvider } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDeleteContext';
import { LaundryQueueDetailProvider } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDetailContext';
import ModalDetailLaundryQueue from '@components/Modals/LaundryQueue/ModalDetailLaundryQueue';

interface Props extends IPageProps {}

export default function AntrianPage({ userAuth }: Props) {
  const TITLE = `Antrian | ${APP_NAME}`;

  const userAuthCtx = useUserAuthContext();

  const createLaundryQueueCtx = useLaundryQueueCreateContext();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Antrian</h1>
        <Row className="row">
          <Col xs={12}>
            <TableLaundryQueue />
          </Col>
        </Row>
      </Container>
      <Offcanvas
        backdrop="static"
        placement="end"
        show={createLaundryQueueCtx.isOpenForm}
        onHide={() => createLaundryQueueCtx.onCloseForm()}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Membuat Antrian</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {createLaundryQueueCtx.isOpenForm ? (
            <>
              {createLaundryQueueCtx?.formType === 'existingCustomer' ? (
                <FormCreateLaundryQueue />
              ) : null}
              {createLaundryQueueCtx?.formType === 'newCustomer' ? (
                <FormCreateCustomerWithLaundryQueue />
              ) : null}
            </>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
      <ModalConfirmDeleteLaundryQueue />
      <ModalDetailLaundryQueue />
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
