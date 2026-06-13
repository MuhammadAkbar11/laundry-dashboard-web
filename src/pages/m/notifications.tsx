/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
import { GetServerSidePropsContext } from 'next';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { IMemberAuth, IMemberPageProps } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import {
  useMarkAllMemberNotificationsRead,
  useMarkMemberNotificationRead,
  useMemberNotificationsList,
  useMemberUnreadNotificationCount,
} from '@hooks/useMemberNotifications';
import {
  MemberNotificationEmptyRow,
  MemberNotificationErrorRow,
  MemberNotificationItem,
  MemberNotificationLoadingRow,
} from '@features/member/notifications/MemberNotificationItem';

const PAGE_SIZE = 10;

type PageProps = IMemberPageProps;

export default function MemberNotificationsPage({ memberAuth }: PageProps) {
  const TITLE = `Notifikasi | ${APP_NAME}`;
  const memberAuthCtx = useMemberAuthContext();

  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  const [pageIndex, setPageIndex] = React.useState(0);
  const listQuery = useMemberNotificationsList({
    pageIndex,
    pageSize: PAGE_SIZE,
    searchTerm: '',
  });
  const unreadQuery = useMemberUnreadNotificationCount();
  const markRead = useMarkMemberNotificationRead();
  const markAllRead = useMarkAllMemberNotificationsRead();

  const rows = listQuery.data?.rows ?? [];
  const totalPages = listQuery.data?.pageCount ?? 0;
  const totalCount = listQuery.data?.entriesCount ?? 0;
  const unreadCount = unreadQuery.data ?? 0;

  const onItemClick = (notification: {
    notificationId: string;
    read: boolean;
  }) => {
    if (!notification.read) {
      markRead.mutate(notification.notificationId);
    }
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Notifikasi" />

      <Container className="pb-5">
        <Row className="mb-3 align-items-center">
          <Col>
            <div className="text-muted small">
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
              data-testid="mark-all-read"
            >
              {markAllRead.isPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Tandai semua dibaca'
              )}
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <ul
              className="list-group shadow-none border"
              data-testid="member-notification-list"
            >
              {listQuery.isLoading ? (
                <MemberNotificationLoadingRow layout="page" />
              ) : listQuery.isError ? (
                <MemberNotificationErrorRow
                  layout="page"
                  message={
                    (listQuery.error as any)?.message ||
                    'Gagal memuat notifikasi.'
                  }
                />
              ) : rows.length === 0 ? (
                <MemberNotificationEmptyRow layout="page" />
              ) : (
                rows.map((n) => (
                  <MemberNotificationItem
                    key={n.notificationId}
                    notification={n}
                    onItemClick={onItemClick}
                  />
                ))
              )}
            </ul>
          </Col>
        </Row>

        {totalPages > 1 ? (
          <Row className="mt-3 align-items-center">
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
    const memberAuth = (await getMemberSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    return {
      props: {
        memberAuth,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (uIsUnauthorizedError(err) || uIsForbiddenError(err)) {
      return {
        redirect: {
          destination: `/login?redirect=${url}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        errorCode: uGetStatusCode(err),
        memberAuth: null,
      },
    };
  }
}

MemberNotificationsPage.layout = WebMemberLayout;
