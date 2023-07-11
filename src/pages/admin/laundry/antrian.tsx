/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import TableLaundryQueue from '@components/Tables/Laundry/TableLaundryQueue';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@/services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps, IUserAuth } from '@utils/interfaces';
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

AntrianPage.providers = [
  LaundryQueueCreateProvider,
  LaundryQueueDeleteProvider,
  LaundryQueueDetailProvider,
];

AntrianPage.layout = AdminLayout;
