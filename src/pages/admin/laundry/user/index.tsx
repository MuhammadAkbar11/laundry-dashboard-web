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
  UserActionsProvider,
  useUserActionsContext,
} from '@utils/context/User/UserActionsContext';
import TableUser from '@components/Tables/TableUser';
import FormCreateUser from '@components/Forms/FormUser/FormCreateUser';
import { UserDeleteProvider } from '@utils/context/User/UserDeleteContext';
import ModalConfirmDeleteUser from '@components/Modals/User/ModalConfirmDeleteUser';
import FormUpdateUser from '@components/Forms/FormUser/FormUpdateUser';

interface Props extends IPageProps {}

export default function UserPage({ userAuth }: Props) {
  const TITLE = `User | ${APP_NAME}`;

  const userAuthCtx = useUserAuthContext();

  const userActionsCtx = useUserActionsContext();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">User</h1>
        <Row className="row">
          <Col xs={12}>
            <TableUser />
          </Col>
        </Row>
      </Container>
      <Offcanvas
        backdrop="static"
        placement="end"
        show={userActionsCtx.isOpenForm}
        onHide={() => userActionsCtx.onCloseForm()}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {userActionsCtx?.formType === 'create' ? 'Tambah Data User' : null}
            {userActionsCtx?.formType === 'update' ? 'Ubah Data User' : null}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {userActionsCtx.isOpenForm ? (
            <>
              {userActionsCtx?.formType === 'create' ? (
                <FormCreateUser />
              ) : null}
              {userActionsCtx?.formType === 'update' ? (
                <FormUpdateUser />
              ) : null}
            </>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
      <ModalConfirmDeleteUser />
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

UserPage.providers = [UserActionsProvider, UserDeleteProvider];

UserPage.layout = AdminLayout;
