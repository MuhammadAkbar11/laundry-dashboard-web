import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { Container, Form, Modal, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@layouts/AdminLayout';
import { getSessionService } from '@services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import {
  IAuditLog,
  IPageProps,
  IPaginationSorting,
  IUserAuth,
} from '@interfaces';
import {
  getAuditLogsService,
  AuditLogListFilters,
} from '@services/auditLogService';
import TableAuditLogs from '@components/Tables/TableAuditLogs';
import type { PaginationState } from '@tanstack/react-table';

interface Props extends IPageProps {}

const ACTIONS = [
  { value: '', label: 'Semua Aksi' },
  { value: 'CREATE', label: 'CREATE' },
  { value: 'UPDATE', label: 'UPDATE' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'LOGIN', label: 'LOGIN' },
  { value: 'LOGOUT', label: 'LOGOUT' },
  { value: 'PASSWORD_RESET', label: 'PASSWORD_RESET' },
  { value: 'STATUS_CHANGE', label: 'STATUS_CHANGE' },
];

const ENTITY_TYPES = [
  { value: '', label: 'Semua Entitas' },
  { value: 'USER', label: 'USER' },
  { value: 'MEMBER', label: 'MEMBER' },
  { value: 'ORDER', label: 'ORDER' },
  { value: 'PAYMENT', label: 'PAYMENT' },
  { value: 'EXPENSE', label: 'EXPENSE' },
  { value: 'NOTIFICATION_TEMPLATE', label: 'NOTIFICATION_TEMPLATE' },
  { value: 'SETTINGS', label: 'SETTINGS' },
];

export default function AuditLogPage({ userAuth }: Props) {
  const TITLE = 'Audit Log | CusCuciin';
  const userAuthCtx = useUserAuthContext();

  const [selectedLog, setSelectedLog] = React.useState<IAuditLog | null>(null);
  const [actionFilter, setActionFilter] = React.useState('');
  const [entityTypeFilter, setEntityTypeFilter] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<IPaginationSorting[]>([
    { id: 'createdAt', desc: true },
  ]);

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  // Reset pagination when filters change so the user always sees the first
  // matching page rather than landing on a stale page index.
  React.useEffect(() => {
    setPageIndex(0);
  }, [actionFilter, entityTypeFilter]);

  const sort = sorting[0];
  let sortBy: 'asc' | 'desc' | null = null;
  if (sort != null) {
    sortBy = sort.desc ? 'desc' : 'asc';
  }

  const auditLogsQuery = useQuery({
    // Include every input that affects the result set in the query key so
    // React Query treats a filter change as a brand-new request and refetches
    // automatically — no manual invalidation required.
    queryKey: [
      'auditLogs',
      {
        action: actionFilter,
        entityType: entityTypeFilter,
        searchTerm,
        pageIndex,
        pageSize,
        orderBy: sort?.id,
        sortBy,
      },
    ],
    queryFn: () =>
      getAuditLogsService({
        pageIndex,
        pageSize,
        searchTerm,
        sorting,
        action: actionFilter || undefined,
        entityType: entityTypeFilter || undefined,
      }),
    keepPreviousData: true,
  });

  const apiData = auditLogsQuery.data as
    | { rows: IAuditLog[]; entriesCount?: number; pageCount?: number }
    | undefined;
  const rows: IAuditLog[] = apiData?.rows || [];
  const pageCount: number = apiData?.pageCount ?? 0;
  const entriesCount: number = apiData?.entriesCount ?? 0;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Audit Log</h1>

          {/* {auditLogsQuery.isFetching && !auditLogsQuery.isLoading ? (
            <div
              className="d-flex align-items-center text-muted small"
              role="status"
              aria-live="polite"
            >
              <Spinner
                animation="border"
                role="status"
                size="sm"
                className="me-2"
              />
              Memuat data…
            </div>
          ) : null} */}
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Form.Group style={{ minWidth: 160 }}>
            <Form.Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              disabled={auditLogsQuery.isLoading}
            >
              {ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group style={{ minWidth: 180 }}>
            <Form.Select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              disabled={auditLogsQuery.isLoading}
            >
              {ENTITY_TYPES.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group style={{ minWidth: 240 }}>
            <Form.Control
              type="text"
              placeholder="Cari (aktor, entity id, metadata)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(0);
              }}
              disabled={auditLogsQuery.isLoading}
            />
          </Form.Group>
        </div>
        <TableAuditLogs
          rows={rows}
          isLoading={auditLogsQuery.isFetching && !auditLogsQuery.isLoading}
          isError={auditLogsQuery.isError}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          entriesCount={entriesCount}
          sorting={sorting}
          globalFilter={searchTerm}
          onSortingChange={setSorting}
          onPaginationChange={(updater) => {
            const current: PaginationState = { pageIndex, pageSize };
            const next =
              typeof updater === 'function' ? updater(current) : updater;
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
          }}
          onGlobalFilterChange={setSearchTerm}
          onDetail={setSelectedLog}
        />
      </Container>

      <Modal
        show={!!selectedLog}
        onHide={() => setSelectedLog(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Audit Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div>
              <p className="mb-1">
                <strong>ID:</strong> {selectedLog.auditLogId}
              </p>
              <p className="mb-1">
                <strong>Aksi:</strong>{' '}
                <span className="badge bg-primary">{selectedLog.action}</span>
              </p>
              <p className="mb-1">
                <strong>Entitas:</strong> {selectedLog.entityType} -{' '}
                {selectedLog.entityId}
              </p>
              <p className="mb-1">
                <strong>Aktor:</strong>{' '}
                {selectedLog.actorName || selectedLog.actorId || '-'} (
                {selectedLog.actorRole || 'N/A'})
              </p>
              <p className="mb-1">
                <strong>Waktu:</strong>{' '}
                {new Date(selectedLog.createdAt).toLocaleString('id-ID')}
              </p>
              <hr />
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(selectedLog.metadata, null, 2)}
              </pre>
            </div>
          )}
        </Modal.Body>
      </Modal>
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

AuditLogPage.layout = AdminLayout;

// Keep the symbol referenced even when imported as type-only elsewhere.
export type { AuditLogListFilters };
