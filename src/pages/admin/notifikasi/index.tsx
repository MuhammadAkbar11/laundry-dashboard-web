/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { APP_NAME } from '@configs/varsConfig';
import AdminLayout from '@layouts/AdminLayout';
import { getSessionService } from '@services/authSevices';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { IPageProps, IUserAuth } from '@utils/interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import {
  useMarkAllUserNotificationsRead,
  useMarkUserNotificationRead,
  useUserNotificationsList,
  useUserUnreadNotificationCount,
} from '@hooks/useUserNotifications';
import {
  AdminNotificationEmptyRow,
  AdminNotificationErrorRow,
  AdminNotificationItem,
  AdminNotificationLoadingRow,
} from '@features/admin/notifications/AdminNotificationItem';

const PAGE_SIZE = 10;

type PageProps = IPageProps;

export default function AdminNotificationsPage({ userAuth }: PageProps) {
  const TITLE = `Notifikasi | ${APP_NAME}`;
  const userAuthCtx = useUserAuthContext();

  React.useEffect(() => {
    if (userAuth) userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  const [pageIndex, setPageIndex] = React.useState(0);
  const listQuery = useUserNotificationsList({
    pageIndex,
    pageSize: PAGE_SIZE,
    searchTerm: '',
  });
  const unreadQuery = useUserUnreadNotificationCount();
  const markRead = useMarkUserNotificationRead();
  const markAllRead = useMarkAllUserNotificationsRead();

  const rows = listQuery.data?.rows ?? [];
  const totalPages = listQuery.data?.pageCount ?? 0;
  const totalCount = listQuery.data?.entriesCount ?? 0;
  const unreadCount = unreadQuery.data ?? 0;

  const onItemClick = (notification: { id: string; isRead: boolean }) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <Container fluid className="p-0">
        <Row className="mb-3 align-items-center mx-0">
          <Col>
            <h1 className="h3 mb-0">Notifikasi</h1>
            <div className="text-muted small mt-1">
              {unreadCount > 0
                ? `${unreadCount} notifikasi belum dibaca.`
                : 'Semua notifikasi sudah dibaca.'}
              {totalCount > 0 ? ` Total: ${totalCount}.` : ''}
            </div>
          </Col>
          <Col xs="auto">
            <Button
              variant="accent1"
              size="sm"
              onClick={() => markAllRead.mutate()}
              disabled={unreadCount === 0 || markAllRead.isPending}
              data-testid="admin-mark-all-read"
            >
              {markAllRead.isPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Tandai semua dibaca'
              )}
            </Button>
          </Col>
        </Row>

        <Row className="mx-0">
          <Col xs={12} className="px-0">
            <ul
              className="list-group shadow-none border"
              data-testid="admin-notification-list"
            >
              {listQuery.isLoading ? (
                <AdminNotificationLoadingRow layout="page" />
              ) : listQuery.isError ? (
                <AdminNotificationErrorRow
                  layout="page"
                  message={
                    (listQuery.error as any)?.message ||
                    'Gagal memuat notifikasi.'
                  }
                />
              ) : rows.length === 0 ? (
                <AdminNotificationEmptyRow layout="page" />
              ) : (
                rows.map((n) => (
                  <AdminNotificationItem
                    key={n.id}
                    notification={n}
                    onItemClick={onItemClick}
                  />
                ))
              )}
            </ul>
          </Col>
        </Row>

        {totalPages > 1 ? (
          <Row className="mt-3 align-items-center mx-0">
            <Col>
              <div className="text-muted small">
                Halaman {pageIndex + 1} dari {totalPages}
              </div>
            </Col>
            <Col xs="auto">
              <div className="btn-group" role="group">
                <Button
                  variant="outline-accent1"
                  size="sm"
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex === 0 || listQuery.isFetching}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline-accent1"
                  size="sm"
                  onClick={() =>
                    setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={pageIndex >= totalPages - 1 || listQuery.isFetching}
                >
                  Berikutnya
                </Button>
              </div>
            </Col>
          </Row>
        ) : null}
      </Container>
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

    return {
      props: {
        userAuth,
      },
    };
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

AdminNotificationsPage.layout = AdminLayout;
