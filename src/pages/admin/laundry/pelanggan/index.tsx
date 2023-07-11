/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import AdminLayout from '@/layouts/AdminLayout';
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
import TableCustomer from '@components/Tables/TableCustomer';
import {
  CustomerPageProvider,
  useCustomerPageContext,
} from '@utils/context/Customer/CustomerPageContext';
import FormCreateCustomer from '@components/Forms/FormsCustomer/FormCreateCustomer';
import FormUpdateCustomer from '@components/Forms/FormsCustomer/FormUpdateCustomer';
import { CustomerDeleteProvider } from '@utils/context/Customer/CustomerDeleteContext';
import ModalConfirmationCustomerDelete from '@components/Modals/Customer/ModalConfirmDeleteCustomer';

interface Props extends IPageProps {}

export default function PelangganPage({ userAuth }: Props) {
  const userAuthCtx = useUserAuthContext();

  const customerPageCtx = useCustomerPageContext();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  return (
    <>
      <Head>
        <title>Pelanggan | AdminKit Demo</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Pelanggan</h1>
        <Row className="row">
          <Row className="row">
            <Col xs={12}>
              <TableCustomer />
            </Col>
          </Row>
        </Row>
      </Container>
      {/* Convass Form Action */}
      <Offcanvas
        backdrop="static"
        placement="end"
        show={customerPageCtx.formActionOffCanvas.open}
        onHide={() =>
          customerPageCtx.onToggleFormActionOffCanvas({
            open: false,
            formType: 'initial',
          })
        }
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {customerPageCtx?.formActionOffCanvas?.formType === 'create'
              ? 'Tambah Data Pelanggan'
              : null}
            {customerPageCtx?.formActionOffCanvas?.formType === 'update'
              ? 'Ubah Data Pelanggan'
              : null}
            {customerPageCtx?.formActionOffCanvas?.formType === 'initial'
              ? 'Loading...'
              : null}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {customerPageCtx?.formActionOffCanvas?.formType === 'create' ? (
            <FormCreateCustomer />
          ) : null}

          {customerPageCtx?.formActionOffCanvas?.formType === 'update' ? (
            <FormUpdateCustomer />
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
      <ModalConfirmationCustomerDelete />
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

PelangganPage.providers = [CustomerPageProvider, CustomerDeleteProvider];

PelangganPage.layout = AdminLayout;
