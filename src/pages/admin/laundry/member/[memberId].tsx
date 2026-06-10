/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Badge,
  Spinner,
  Modal,
} from 'react-bootstrap';
import AdminLayout from '@layouts/AdminLayout';
import { getSessionService } from '@services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
  uRupiah,
} from '@utils/utils';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { IPageProps, IUserAuth } from '@utils/interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminMemberByIdService,
  putAdminMemberService,
  postAdminMemberResetPasswordService,
  putAdminMemberAvatarService,
} from '@services/adminMemberService';
import useNotification from '@hooks/useNotification';
import { API_URI } from '@configs/varsConfig';
import AppIcon from '@components/Icons/AppIcon';

interface Props extends IPageProps {
  memberId: string;
}

export default function AdminMemberDetailPage({ userAuth, memberId }: Props) {
  const TITLE = 'Detail Member | Admin';
  const userAuthCtx = useUserAuthContext();
  const notif = useNotification();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    status: 'PENDING' as string,
  });
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [tempPassword, setTempPassword] = React.useState('');

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-member', memberId],
    queryFn: () => getAdminMemberByIdService(memberId),
  });

  const member = data?.member;
  const stats = data?.stats || {};

  React.useEffect(() => {
    if (member) {
      setFormData({
        name: member.customer?.name || '',
        phone: member.customer?.phone || '',
        email: member.email || '',
        username: member.username || '',
        status: member.status || 'PENDING',
      });
    }
  }, [member]);

  const updateMutation = useMutation(
    (payload: any) => putAdminMemberService(memberId, payload),
    {
      onSuccess(resp: any) {
        notif.success(resp?.message || 'Member berhasil diperbarui');
        queryClient.invalidateQueries({ queryKey: ['admin-member', memberId] });
        setEditMode(false);
      },
      onError(err: any) {
        notif.danger(err?.message || 'Gagal memperbarui member');
      },
    }
  );

  const resetMutation = useMutation(
    () => postAdminMemberResetPasswordService(memberId),
    {
      onSuccess(resp: any) {
        setTempPassword(resp.temporaryPassword);
        notif.success(resp?.message || 'Password berhasil direset');
      },
      onError(err: any) {
        notif.danger(err?.message || 'Gagal mereset password');
      },
    }
  );

  const handleSave = () => {
    const payload: any = {
      username: formData.username,
      status: formData.status,
    };
    if (formData.email !== member?.email) {
      payload.email = formData.email;
    }
    if (
      formData.name !== member?.customer?.name ||
      formData.phone !== member?.customer?.phone
    ) {
      payload.customer = {
        name: formData.name,
        phone: formData.phone,
      };
    }
    updateMutation.mutate(payload);
  };

  const handleResetPassword = () => {
    resetMutation.mutate();
    setShowResetModal(false);
  };

  const statusVariant = (s: string) => {
    switch (s) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'secondary';
      case 'SUSPENDED':
        return 'danger';
      default:
        return 'warning';
    }
  };
  const avatar = member?.avatar
    ? `${API_URI}${member?.avatar}`
    : '/img/avatars/avatar-1.png';

  const avatarFileRef = React.useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const avatarMutation = useMutation(
    (file: File | null) => putAdminMemberAvatarService(memberId, file),
    {
      onSuccess(resp: any) {
        notif.success(resp?.message || 'Avatar berhasil diperbarui');
        queryClient.invalidateQueries({ queryKey: ['admin-member', memberId] });
        setAvatarPreview(null);
      },
      onError(err: any) {
        notif.danger(err?.message || 'Gagal memperbarui avatar');
      },
    }
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    avatarMutation.mutate(file);
  };

  const handleAvatarReset = () => {
    setAvatarPreview(null);
    avatarMutation.mutate(null);
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Detail Member</h1>
          <div className="d-flex gap-2">
            <Button variant="warning" onClick={() => setShowResetModal(true)}>
              <AppIcon name="Unlock" />
              <span className="ms-2">Reset Password</span>
            </Button>
            {member?.avatar && member.avatar !== '/img/avatars/avatar.jpg' && (
              <Button
                variant="dark"
                onClick={handleAvatarReset}
                disabled={avatarMutation.isLoading}
              >
                {avatarMutation.isLoading ? (
                  <>
                    <AppIcon name="Loader" />
                    <span className="ms-2">Mereset...</span>
                  </>
                ) : (
                  <>
                    <AppIcon name="Trash2" />
                    <span className="ms-2">Reset Foto</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : !member ? (
          <p>Member tidak ditemukan</p>
        ) : (
          <Row>
            <Col lg={4}>
              {/* <Button
                    variant="primary"
                    size="sm"
                    onClick={() => avatarFileRef.current?.click()}
                    disabled={avatarMutation.isLoading}
                  >
                    {avatarMutation.isLoading ? 'Uploading...' : 'Ganti Foto'}
                  </Button> */}

              <Card className="pt-3 border border-gray-200">
                <Card.Body className="text-center">
                  <div className="avatar-upload">
                    <Form.Label
                      htmlFor="member-avatar-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="avatar-upload-img rounded-circle"
                        style={{ height: 120, width: 120 }}
                      >
                        <img
                          className="w-100 h-100 rounded-circle"
                          src={avatarPreview || avatar}
                          alt=""
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="avatar-upload-img-icon text-white rounded-circle">
                          <AppIcon name="Upload" />
                        </div>
                      </div>
                    </Form.Label>
                    <input
                      ref={avatarFileRef}
                      id="member-avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <h5 className="mt-2">
                    {member.customer?.name || 'Tidak ada nama'}
                  </h5>
                  <p className="text-muted mb-1">{member.email}</p>
                  <Badge bg={statusVariant(member.status)}>
                    {member.status}
                  </Badge>
                </Card.Body>
                {/* <Card.Footer className="bg-light d-flex justify-content-center gap-2">

                </Card.Footer> */}
              </Card>
              <Card className="mt-3 border border-gray-200">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Statistik</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Pesanan:</span>
                    <strong>{stats.totalOrders || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Transaksi:</span>
                    <strong>{stats.totalTransactions || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total Belanja:</span>
                    <strong>{uRupiah(Number(stats.totalSpending) || 0)}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card className="border border-gray-200 ">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">
                    {editMode ? 'Edit Member' : 'Informasi Member'}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Member ID</Form.Label>
                        <Form.Control value={member.memberId} disabled />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Customer ID</Form.Label>
                        <Form.Control
                          value={member.customer?.customerId || '-'}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                          value={formData.name}
                          disabled={!editMode}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, name: e.target.value }))
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>No. Telepon</Form.Label>
                        <Form.Control
                          value={formData.phone}
                          disabled={!editMode}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          value={formData.email}
                          disabled={!editMode}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          value={formData.username}
                          disabled={!editMode}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              username: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={formData.status}
                          disabled={!editMode}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="PENDING">Pending</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Level Member</Form.Label>
                        <Form.Control
                          value={member.customer?.customerLevel?.name || '-'}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tanggal Daftar</Form.Label>
                        <Form.Control
                          value={new Date(member.createdAt).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Point</Form.Label>
                        <Form.Control
                          value={member.customer?.point || 0}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-light pt-0 ">
                  {!editMode ? (
                    <Button variant="primary" onClick={() => setEditMode(true)}>
                      <AppIcon name="Edit" />
                      <span className="ms-2">Edit</span>
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        onClick={handleSave}
                        disabled={updateMutation.isLoading}
                      >
                        {updateMutation.isLoading ? (
                          <>
                            <AppIcon name="Loader" />
                            <span className="ms-2">Mereset...</span>
                          </>
                        ) : (
                          <>
                            <AppIcon name="Save" />
                            <span className="ms-2">Simpan</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditMode(false)}
                      >
                        <AppIcon name="X" />
                        <span className="ms-2">Batal</span>
                      </Button>
                    </div>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        )}

        {/* Reset password modal */}
        <Modal
          show={showResetModal}
          onHide={() => setShowResetModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Reset Password Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {tempPassword ? (
              <div className="text-center">
                <p>Password temporary untuk member ini:</p>
                <h3 className="text-primary fw-bold">{tempPassword}</h3>
                <p className="text-muted">
                  Berikan password ini kepada member. Password akan berfungsi
                  setelah disimpan.
                </p>
              </div>
            ) : (
              <p>
                Apakah Anda yakin ingin mereset password member{' '}
                <strong>{member?.customer?.name || memberId}</strong>?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
            >
              {tempPassword ? 'Tutup' : 'Batal'}
            </Button>
            {!tempPassword && (
              <Button
                variant="warning"
                onClick={handleResetPassword}
                disabled={resetMutation.isLoading}
              >
                {resetMutation.isLoading ? 'Merreset...' : 'Reset Password'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const url = uReplaceURL(ctx.req.url as string);
  const memberId = ctx.query.memberId as string;

  try {
    const userAuth = (await getSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    })) as IUserAuth;

    if (!userAuth) return uNotAuthRedirect(url);
    const hasPermission = await uCheckPermissions(userAuth, url as string);
    return { props: { userAuth, memberId, isRestricted: !hasPermission } };
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

AdminMemberDetailPage.layout = AdminLayout;
