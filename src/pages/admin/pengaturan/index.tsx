/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
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
import { IPageProps, IUserAuth, ISettingItem } from '@utils/interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSettingsRawService,
  putSettingsService,
} from '@services/settingService';
import useNotification from '@hooks/useNotification';

interface Props extends IPageProps {}

export default function PengaturanPage({ userAuth }: Props) {
  const TITLE = 'Pengaturan | CusCuciin';
  const userAuthCtx = useUserAuthContext();
  const notif = useNotification();
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    {}
  );
  const [bankInfo, setBankInfo] = React.useState<
    { bank_name: string; no_rek: string }[]
  >([]);
  const [newBankName, setNewBankName] = React.useState('');
  const [newBankRek, setNewBankRek] = React.useState('');

  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  const { data: settingsData, isLoading } = useQuery<ISettingItem[]>({
    queryKey: ['settings-raw'],
    queryFn: () => getSettingsRawService() as Promise<any>,
  });

  React.useEffect(() => {
    if (settingsData) {
      const values: Record<string, string> = {};
      settingsData.forEach((s) => {
        values[s.name] = s.value;
      });
      setFormValues(values);

      // Parse bank_info JSON
      const bankInfoStr = values.bank_info;
      if (bankInfoStr) {
        try {
          setBankInfo(JSON.parse(bankInfoStr));
        } catch {
          setBankInfo([]);
        }
      }
    }
  }, [settingsData]);

  const updateMutation = useMutation(putSettingsService, {
    onSuccess(response: any) {
      notif.success(response?.message || 'Pengaturan berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['settings-raw'] });
    },
    onError(error: any) {
      notif.danger(error?.message || 'Gagal menyimpan pengaturan');
    },
  });

  const handleSave = () => {
    const settingsPayload = Object.entries(formValues)
      .filter(([name]) => name !== 'bank_info')
      .map(([name, value]) => ({ name, value }));

    // Add bank_info
    settingsPayload.push({
      name: 'bank_info',
      value: JSON.stringify(bankInfo),
    });

    updateMutation.mutate(settingsPayload);
  };

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBank = () => {
    if (!newBankName.trim() || !newBankRek.trim()) {
      notif.danger('Nama bank dan nomor rekening wajib diisi');
      return;
    }
    setBankInfo((prev) => [
      ...prev,
      { bank_name: newBankName.trim(), no_rek: newBankRek.trim() },
    ]);
    setNewBankName('');
    setNewBankRek('');
  };

  const handleRemoveBank = (index: number) => {
    setBankInfo((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Pengaturan</h1>

        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Informasi Laundry</Card.Title>
              </Card.Header>
              <Card.Body>
                {isLoading ? (
                  <p>Memuat data...</p>
                ) : (
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Nama Laundry</Form.Label>
                          <Form.Control
                            value={formValues.name || ''}
                            onChange={(e) =>
                              handleChange('name', e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Kode Pos</Form.Label>
                          <Form.Control
                            value={formValues.kodepos || ''}
                            onChange={(e) =>
                              handleChange('kodepos', e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Alamat</Form.Label>
                      <Form.Control
                        value={formValues.alamat || ''}
                        onChange={(e) => handleChange('alamat', e.target.value)}
                      />
                    </Form.Group>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Kelurahan</Form.Label>
                          <Form.Control
                            value={formValues.kelurahan || ''}
                            onChange={(e) =>
                              handleChange('kelurahan', e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Kecamatan</Form.Label>
                          <Form.Control
                            value={formValues.kecamatan || ''}
                            onChange={(e) =>
                              handleChange('kecamatan', e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Kabupaten</Form.Label>
                          <Form.Control
                            value={formValues.kabupaten || ''}
                            onChange={(e) =>
                              handleChange('kabupaten', e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Provinsi</Form.Label>
                          <Form.Control
                            value={formValues.provinsi || ''}
                            onChange={(e) =>
                              handleChange('provinsi', e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Informasi Bank</Card.Title>
              </Card.Header>
              <Card.Body>
                {bankInfo.map((bank, index) => (
                  <div
                    key={`${bank.bank_name}-${bank.no_rek}`}
                    className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                  >
                    <div>
                      <strong>{bank.bank_name}</strong>
                      <br />
                      <small className="text-muted">{bank.no_rek}</small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveBank(index)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}

                <hr />
                <h6>Tambah Bank Baru</h6>
                <Form.Group className="mb-2">
                  <Form.Control
                    placeholder="Nama Bank (contoh: BNI)"
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    size="sm"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    placeholder="Nomor Rekening"
                    value={newBankRek}
                    onChange={(e) => setNewBankRek(e.target.value)}
                    size="sm"
                  />
                </Form.Group>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-100 mb-3"
                  onClick={handleAddBank}
                >
                  + Tambah Bank
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mb-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
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

PengaturanPage.layout = AdminLayout;
