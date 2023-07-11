/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
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
} from '@utils/utils';
import { IPageProps, IUserAuth } from '@interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import {
  LaundryServiceActionsProvider,
  useLaundryServiceActionsContext,
} from '@utils/context/Laundry/LaundryService/LaundryServiceActionsContext';
import TableLaundryService from '@components/Tables/Laundry/TableLaundryService';
import FormCreateLaundryService from '@components/Forms/FormLaundryService/FormCreateLaundryService';
import { LaundryServiceDeleteProvider } from '@utils/context/Laundry/LaundryService/LaundryServiceDeleteContext';
import ModalConfirmDeleteLaundryService from '@components/Modals/ModalConfirmDeleteLaundryService';
import FormUpdateLaundryService from '@components/Forms/FormLaundryService/FormUpdateLaundryService';

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
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {laundryServiceActionsCtx.isOpenForm ? (
            <>
              {laundryServiceActionsCtx?.formType === 'create' ? (
                <FormCreateLaundryService />
              ) : null}
              {laundryServiceActionsCtx?.formType === 'update' ? (
                <FormUpdateLaundryService />
              ) : null}
            </>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
      <ModalConfirmDeleteLaundryService />
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

LaundryServicePage.providers = [
  LaundryServiceActionsProvider,
  LaundryServiceDeleteProvider,
];

LaundryServicePage.layout = AdminLayout;
