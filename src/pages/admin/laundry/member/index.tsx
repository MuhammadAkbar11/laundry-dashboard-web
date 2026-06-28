/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { Container, Button } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
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
import { IPageProps, IUserAuth } from '@utils/interfaces';
import useDataQuery from '@hooks/useDataQuery';
import {
  exportAdminMembersCsvService,
  getAdminMembersService,
} from '@services/adminMemberService';
import AdminDataTable from '@components/Tables/AdminDataTable';
import Link from 'next/link';
import AppIcon from '@components/Icons/AppIcon';
import useNotification from '@hooks/useNotification';

interface Props extends IPageProps {}

export default function AdminMemberListPage({ userAuth }: Props) {
  const TITLE = 'Member | Admin';
  const userAuthCtx = useUserAuthContext();
  const notif = useNotification();

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    dataQuery,
  } = useDataQuery<any>({
    queryKeyPrefix: 'admin-members',
    queryFn: (opt) => getAdminMembersService(opt),
    defaultData: { rows: [], entriesCount: 0, pageCount: 0 } as any,
    defaultSorting: [],
  });

  const apiData = dataQuery?.data as any;
  const rows: any[] = apiData?.rows || [];

  const exportMutation = useMutation(
    () =>
      exportAdminMembersCsvService({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        searchTerm: globalFilter,
        sorting,
      }),
    {
      onSuccess() {
        notif.success('Export CSV member berhasil diunduh');
      },
      onError(error: any) {
        notif.danger(error?.message || 'Gagal export CSV member');
      },
    }
  );

  const columns = React.useMemo(
    () => [
      {
        id: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }: any) =>
          pagination.pageIndex * pagination.pageSize + row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'memberId',
        header: 'Member ID',
        cell: (info: any) => info.getValue(),
      },
      {
        accessorFn: (row: any) => row.customer?.name || '-',
        id: 'name',
        header: 'Nama',
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: 'username',
        header: 'Username',
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info: any) => {
          const status = info.getValue();
          const badgeClass =
            status === 'ACTIVE'
              ? 'badge bg-success'
              : status === 'INACTIVE'
              ? 'badge bg-secondary'
              : status === 'SUSPENDED'
              ? 'badge bg-danger'
              : 'badge bg-warning';
          return <span className={badgeClass}>{status}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.customer?._count?.laundryQueues || 0,
        id: 'orders',
        header: 'Total Pesanan',
        enableSorting: false,
      },
      {
        id: 'action',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }: any) => (
          <Link
            href={`/admin/laundry/member/${row.original.memberId}`}
            passHref
            legacyBehavior
          >
            <Button size="sm" variant="primary" as="a">
              <AppIcon name="Info" />
            </Button>
          </Link>
        ),
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Data Member</h1>
        <AdminDataTable<any>
          title="Semua Member"
          columns={columns}
          data={rows}
          enableSearch
          isLoading={dataQuery?.isLoading}
          isError={dataQuery?.isError}
          pageCount={apiData?.pageCount ?? 0}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          entriesCount={apiData?.entriesCount ?? 0}
          sorting={sorting}
          globalFilter={globalFilter}
          onSortingChange={setSorting}
          onPaginationChange={setPagination}
          onGlobalFilterChange={setGlobalFilter}
          searchPlaceholder="Cari member..."
          headerActions={
            <Button
              variant="success"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isLoading}
            >
              {exportMutation.isLoading ? 'Mengunduh...' : 'Export CSV'}
            </Button>
          }
        />
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
    const hasPermission = await uCheckPermissions(userAuth, url as string);
    return { props: { userAuth, isRestricted: !hasPermission } };
  } catch (err: any) {
    if (uIsUnauthorizedError(err) || uIsForbiddenError(err)) {
      return {
        redirect: {
          destination: `/admin/login?redirect=${url}`,
          permanent: false,
        },
      };
    }
    return { props: { errorCode: uGetStatusCode(err), userAuth: null } };
  }
}

AdminMemberListPage.layout = AdminLayout;
