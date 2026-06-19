/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEye, faSync } from '@fortawesome/free-solid-svg-icons';
import type { INotificationTemplate } from '@interfaces';
import {
  useNotificationTemplate,
  usePreviewNotificationTemplate,
  useResetNotificationTemplate,
  useUpdateNotificationTemplate,
} from '@hooks/useNotificationTemplates';

type Props = {
  templateId: string | null;
  show: boolean;
  onHide: () => void;
};

function NotificationTemplateEditModal({ templateId, show, onHide }: Props) {
  const detail = useNotificationTemplate(templateId);
  const [titleTemplate, setTitleTemplate] = React.useState('');
  const [messageTemplate, setMessageTemplate] = React.useState('');
  const [preview, setPreview] = React.useState<{
    title: string;
    message: string;
    variablesUsed: string[];
  } | null>(null);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const updateMutation = useUpdateNotificationTemplate();
  const previewMutation = usePreviewNotificationTemplate();
  const resetMutation = useResetNotificationTemplate();

  // Sync the editor state with the loaded template, and clear any
  // preview/error state when the user picks a different template.
  React.useEffect(() => {
    if (detail.data) {
      setTitleTemplate(detail.data.titleTemplate);
      setMessageTemplate(detail.data.messageTemplate);
      setPreview(null);
      setPreviewError(null);
      setSaveError(null);
    }
  }, [detail.data]);

  const onPreview = () => {
    if (!templateId) return;
    setPreviewError(null);
    previewMutation.mutate(
      {
        templateId,
        payload: { titleTemplate, messageTemplate },
      },
      {
        onSuccess: (data) => setPreview(data),
        onError: (err: any) =>
          setPreviewError(err?.message || 'Gagal membuat preview template.'),
      }
    );
  };

  const onResetToDefault = () => {
    if (!templateId) return;
    setSaveError(null);
    resetMutation.mutate(templateId, {
      onSuccess: (data) => {
        setTitleTemplate(data.titleTemplate);
        setMessageTemplate(data.messageTemplate);
        setPreview(null);
      },
      onError: (err: any) =>
        setSaveError(
          err?.message || 'Gagal mengembalikan template ke default.'
        ),
    });
  };

  const onInsertVariable = (name: string) => {
    setMessageTemplate((prev) => `${prev}{${name}}`);
  };

  const onSave = () => {
    if (!templateId) return;
    setSaveError(null);
    updateMutation.mutate(
      {
        templateId,
        payload: { titleTemplate, messageTemplate },
      },
      {
        onSuccess: () => onHide(),
        onError: (err: any) =>
          setSaveError(err?.message || 'Gagal menyimpan template.'),
      }
    );
  };

  // The backend may return supportedVariables either as a parsed
  // string[] (current API) or as a raw JSON string (legacy). Normalize
  // so the renderer can `.map` safely in both cases.
  const supportedVariables: string[] = React.useMemo(() => {
    const raw = detail.data?.supportedVariables as unknown;
    if (Array.isArray(raw)) {
      return raw.filter((v): v is string => typeof v === 'string');
    }
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((v): v is string => typeof v === 'string');
        }
      } catch {
        // fall through to empty array
      }
    }
    return [];
  }, [detail.data?.supportedVariables]);
  const hasDefaults =
    !!detail.data?.defaultTitleTemplate &&
    !!detail.data?.defaultMessageTemplate;
  const isDirty =
    detail.data != null &&
    (titleTemplate !== detail.data.titleTemplate ||
      messageTemplate !== detail.data.messageTemplate);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {detail.data
            ? `Edit Template — ${
                detail.data.notificationType?.name ??
                detail.data.notificationType?.code ??
                'Notifikasi'
              }`
            : 'Edit Template Notifikasi'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detail.isLoading ? (
          <div className="text-center py-4 text-muted">
            <Spinner
              animation="border"
              size="sm"
              role="status"
              className="me-2"
            >
              <span className="visually-hidden">Memuat...</span>
            </Spinner>
            Memuat template...
          </div>
        ) : detail.isError ? (
          <Alert variant="danger">Gagal memuat detail template.</Alert>
        ) : detail.data ? (
          <>
            <div className="mb-3 p-3 bg-light rounded">
              <div className="small text-muted mb-1">Tipe Notifikasi</div>
              <div>
                <code>{detail.data.notificationType?.code}</code>{' '}
                <span className="text-muted">
                  — {detail.data.notificationType?.name}
                </span>
              </div>
              {detail.data.notificationType?.description ? (
                <div className="small text-muted mt-1">
                  {detail.data.notificationType.description}
                </div>
              ) : null}
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Judul Template</Form.Label>
                <Form.Control
                  type="text"
                  value={titleTemplate}
                  onChange={(e) => setTitleTemplate(e.target.value)}
                  maxLength={255}
                  placeholder="Judul template notifikasi"
                />
                <Form.Text className="text-muted">
                  Maksimal 255 karakter. Mendukung variabel{' '}
                  <code>{'{namaVariabel}'}</code>.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pesan Template</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Isi pesan notifikasi"
                />
                <Form.Text className="text-muted">
                  Mendukung multi-line. Variabel yang tersedia akan diganti saat
                  notifikasi dikirim.
                </Form.Text>
              </Form.Group>

              <div className="mb-3">
                <div className="small text-muted mb-2">
                  Variabel yang didukung (read-only)
                </div>
                {supportedVariables?.length === 0 ? (
                  <div className="small text-muted fst-italic">
                    Tidak ada variabel.
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {supportedVariables &&
                      supportedVariables?.map((v) => (
                        <Badge
                          key={v}
                          bg="secondary"
                          as="button"
                          type="button"
                          className="font-monospace border-0"
                          onClick={() => onInsertVariable(v)}
                          title="Klik untuk menyisipkan ke pesan"
                        >
                          {`{${v}}`}
                        </Badge>
                      ))}
                  </div>
                )}
                <div className="small text-muted mt-2">
                  Klik variabel untuk menyisipkannya ke pesan. Nama tipe, kode
                  tipe, dan variabel tidak dapat diedit dari halaman ini.
                  Hubungi developer untuk menambah atau mengubah arsitektur
                  notifikasi.
                </div>
              </div>

              {saveError ? (
                <Alert variant="danger" className="py-2">
                  {saveError}
                </Alert>
              ) : null}

              {previewError ? (
                <Alert variant="warning" className="py-2">
                  {previewError}
                </Alert>
              ) : null}

              {preview ? (
                <Alert variant="info" className="py-2">
                  <div className="fw-semibold mb-1">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Preview (data contoh)
                  </div>
                  <div className="small">
                    <strong>Judul:</strong>{' '}
                    {preview.title || <em className="text-muted">(kosong)</em>}
                  </div>
                  <div className="small mt-1">
                    <strong>Pesan:</strong>
                    <pre
                      className="mb-0 mt-1 p-2 bg-white border rounded small"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {preview.message || (
                        <em className="text-muted">(kosong)</em>
                      )}
                    </pre>
                  </div>
                </Alert>
              ) : null}
            </Form>
          </>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100 align-items-center">
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onResetToDefault}
              disabled={
                !hasDefaults ||
                updateMutation.isPending ||
                resetMutation.isPending
              }
              title={
                hasDefaults
                  ? 'Kembalikan ke template default'
                  : 'Tidak ada default untuk template ini'
              }
            >
              <FontAwesomeIcon icon={faUndo} className="me-1" />
              Reset Default
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-accent1"
              size="sm"
              onClick={onPreview}
              disabled={
                previewMutation.isPending ||
                !titleTemplate.trim() ||
                !messageTemplate.trim()
              }
            >
              <FontAwesomeIcon
                icon={previewMutation.isPending ? faSync : faEye}
                spin={previewMutation.isPending}
                className="me-1"
              />
              Preview
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onHide}
              disabled={updateMutation.isPending}
              className="me-2"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={
                updateMutation.isPending ||
                !isDirty ||
                !titleTemplate.trim() ||
                !messageTemplate.trim()
              }
            >
              {updateMutation.isPending ? (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-1"
                />
              ) : null}
              Simpan
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default NotificationTemplateEditModal;
