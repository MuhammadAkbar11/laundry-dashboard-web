/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import AdminLayout from '@layouts/AdminLayout';
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
import { IPageProps, IUserAuth, IExpenses } from '@utils/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getExpensesService,
  postExpensesService,
  putExpensesService,
  deleteExpensesService,
  exportExpensesCsvService,
} from '@services/expensesService';
import useNotification from '@hooks/useNotification';
import TableExpenses from '@components/Tables/TableExpenses';
import useDataQuery from '@hooks/useDataQuery';

interface Props extends IPageProps {}

export default function PengeluaranPage({ userAuth }: Props) {
  const TITLE = 'Pengeluaran | CusCuciin';
  const userAuthCtx = useUserAuthContext();
  const notif = useNotification();
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [total, setTotal] = React.useState<number>(0);
  const [selectedExpenses, setSelectedExpenses] =
    React.useState<IExpenses | null>(null);

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
  } = useDataQuery<
    | {
        rows: IExpenses[];
        entriesCount?: number;
        pageCount?: number;
      }
    | IExpenses[]
  >({
    queryKeyPrefix: 'expenses',
    queryFn: (opt) =>
      getExpensesService({
        pageIndex: opt.pageIndex,
        pageSize: opt.pageSize,
        searchTerm: opt.searchTerm,
        sorting: opt.sorting,
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultData: { rows: [], entriesCount: 0, pageCount: 0 } as any,
    defaultSorting: [],
  });

  const resetForm = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setDescription('');
    setTotal(0);
    setSelectedExpenses(null);
  };

  const createMutation = useMutation(postExpensesService, {
    onSuccess(response: any) {
      notif.success(response?.message || 'Pengeluaran berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      resetForm();
    },
    onError(error: any) {
      notif.danger(error?.message || 'Gagal menambahkan pengeluaran');
    },
  });

  const updateMutation = useMutation(putExpensesService, {
    onSuccess(response: any) {
      notif.success(response?.message || 'Pengeluaran berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      resetForm();
    },
    onError(error: any) {
      notif.danger(error?.message || 'Gagal memperbarui pengeluaran');
    },
  });

  const deleteMutation = useMutation(deleteExpensesService, {
    onSuccess(response: any) {
      notif.success(response?.message || 'Pengeluaran berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowDeleteModal(false);
      setSelectedExpenses(null);
    },
    onError(error: any) {
      notif.danger(error?.message || 'Gagal menghapus pengeluaran');
    },
  });

  const exportMutation = useMutation(
    () =>
      exportExpensesCsvService({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        searchTerm: globalFilter,
        sorting,
      }),
    {
      onSuccess() {
        notif.success('Export CSV pengeluaran berhasil diunduh');
      },
      onError(error: any) {
        notif.danger(error?.message || 'Gagal export CSV pengeluaran');
      },
    }
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      notif.danger('Deskripsi wajib diisi');
      return;
    }
    if (total <= 0) {
      notif.danger('Total harus lebih dari 0');
      return;
    }
    createMutation.mutate({ description: description.trim(), total });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpenses) return;
    updateMutation.mutate({
      expensesId: selectedExpenses.expensesId,
      description: description.trim() || undefined,
      total: total > 0 ? total : undefined,
    });
  };

  const handleDelete = () => {
    if (!selectedExpenses) return;
    deleteMutation.mutate(selectedExpenses.expensesId);
  };

  const openEditModal = (exp: IExpenses) => {
    setSelectedExpenses(exp);
    setDescription(exp.description);
    setTotal(exp.total);
    setShowEditModal(true);
  };

  const openDeleteModal = (exp: IExpenses) => {
    setSelectedExpenses(exp);
    setShowDeleteModal(true);
  };

  const apiData = dataQuery?.data as any;
  const rows: IExpenses[] = apiData?.rows || [];

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Data Pengeluaran</h1>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            + Tambah Pengeluaran
          </Button>
        </div>
        <TableExpenses
          rows={rows}
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
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onExport={() => exportMutation.mutate()}
          exportLoading={exportMutation.isLoading}
        />
      </Container>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => resetForm()} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengeluaran</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan deskripsi pengeluaran"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total (Rp)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={total || ''}
                onChange={(e) => setTotal(Number(e.target.value))}
                min={0}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => resetForm()}>
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => resetForm()} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengeluaran</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan deskripsi pengeluaran"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total (Rp)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={total || ''}
                onChange={(e) => setTotal(Number(e.target.value))}
                min={0}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => resetForm()}>
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? 'Memperbarui...' : 'Perbarui'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus pengeluaran{' '}
          <strong>{selectedExpenses?.expensesInvoice}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </Modal.Footer>
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

PengeluaranPage.layout = AdminLayout;
