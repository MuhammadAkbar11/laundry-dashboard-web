/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faBell,
  faLocationCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import { formatDistance } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
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
import { useNotificationTemplatesList } from '@hooks/useNotificationTemplates';
import NotificationTemplateEditModal from '@features/admin/notifications/NotificationTemplateEditModal';

const PAGE_SIZE = 20;

type PageProps = IPageProps;

export default function NotificationTemplatesPage({ userAuth }: PageProps) {
  const TITLE = `Template Notifikasi | ${APP_NAME}`;
  const userAuthCtx = useUserAuthContext();

  React.useEffect(() => {
    if (userAuth) userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  const [pageIndex, setPageIndex] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const listQuery = useNotificationTemplatesList({
    pageIndex,
    pageSize: PAGE_SIZE,
    searchTerm: search,
  });

  const rows = listQuery.data?.rows ?? [];
  const totalPages = listQuery.data?.totalPages ?? 0;
  const totalCount = listQuery.data?.totalItems ?? 0;

  const openEdit = (templateId: string) => {
    setEditingId(templateId);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingId(null);
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <Container fluid className="p-0">
        <Row className="mb-3 align-items-center mx-0">
          <Col>
            <h1 className="h3 mb-0">
              <FontAwesomeIcon icon={faBell} className="me-2" />
              Template Notifikasi
            </h1>
            <div className="text-muted small mt-1">
              Ubah judul dan pesan template. Tipe, kode, dan variabel bersifat
              read-only.
            </div>
          </Col>
          <Col xs="auto">
            <InputGroup size="sm" style={{ minWidth: 280 }}>
              <Form.Control
                type="search"
                placeholder="Cari judul, pesan, atau tipe..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPageIndex(0);
                }}
              />
            </InputGroup>
          </Col>
        </Row>

        <Row className="mx-0">
          <Col xs={12} className="px-0">
            <Table
              responsive
              hover
              className="align-middle shadow-none border"
              data-testid="admin-notification-templates-list"
            >
              <thead>
                <tr>
                  <th style={{ minWidth: 220 }}>Tipe</th>
                  <th>Judul</th>
                  <th>Pesan</th>
                  <th style={{ width: 160 }}>Diubah</th>
                  <th style={{ width: 100 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listQuery.isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      <Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      >
                        <span className="visually-hidden">Memuat...</span>
                      </Spinner>
                      Memuat template...
                    </td>
                  </tr>
                ) : listQuery.isError ? (
                  <tr>
                    <td colSpan={5} className="text-center text-danger py-4">
                      {(listQuery.error as any)?.message ||
                        'Gagal memuat template.'}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      <FontAwesomeIcon
                        icon={faBell}
                        size="2x"
                        className="d-block mx-auto mb-2"
                      />
                      <div className="fw-semibold">Tidak ada template</div>
                      <div className="small">
                        Jalankan seed notifikasi untuk menambahkan template
                        default.
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="fw-semibold">
                          {t.notificationType?.name ?? t.notificationTypeId}
                        </div>
                        <code className="small text-muted">
                          {t.notificationType?.code}
                        </code>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 280 }}>
                        {t.titleTemplate}
                      </td>
                      <td
                        className="text-truncate text-muted small"
                        style={{ maxWidth: 360 }}
                      >
                        {t.messageTemplate}
                      </td>
                      <td className="small text-muted">
                        {formatDistance(new Date(t.updatedAt), new Date(), {
                          addSuffix: true,
                          locale: localeId,
                        })}
                      </td>
                      <td>
                        <Button
                          variant="outline-accent1"
                          size="sm"
                          onClick={() => openEdit(t.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {totalCount > 0 ? (
          <Row className="mt-3 align-items-center mx-0">
            <Col>
              <div className="text-muted small">
                Total {totalCount} template
                {search ? ` (difilter dari "${search}")` : ''}.
              </div>
            </Col>
            {totalPages > 1 ? (
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
                    disabled={
                      pageIndex >= totalPages - 1 || listQuery.isFetching
                    }
                  >
                    Berikutnya
                  </Button>
                </div>
              </Col>
            ) : null}
          </Row>
        ) : null}
      </Container>

      <NotificationTemplateEditModal
        templateId={editingId}
        show={editOpen}
        onHide={closeEdit}
      />
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

NotificationTemplatesPage.layout = AdminLayout;
