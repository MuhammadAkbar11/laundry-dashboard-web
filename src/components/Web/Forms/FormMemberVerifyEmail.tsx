/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Alert, Spinner } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { postVerifyEmailService } from '@services/authMemberService';
import WebButton from '@components/Buttons/WebButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

type Props = {};

function FormMemberVerifyEmail({}: Props) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (token: string) => postVerifyEmailService(token),
  });

  const token = React.useMemo(() => {
    if (!router.isReady) return '';
    const raw = router.query?.token;
    if (Array.isArray(raw)) return raw[0] || '';
    return raw || '';
  }, [router.isReady, router.query?.token]);

  React.useEffect(() => {
    if (!router.isReady) return;
    if (!token) return;
    if (mutation.isPending || mutation.isSuccess || mutation.isError) return;
    mutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, token]);

  if (!router.isReady || mutation.isPending) {
    return (
      <div
        className="text-center py-4"
        role="status"
        aria-live="polite"
        data-testid="verify-email-pending"
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Memverifikasi...</span>
        </Spinner>
        <p className="text-muted mt-3 mb-0">Memverifikasi email Anda...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <Alert
        variant="danger"
        className="text-center mb-0"
        data-testid="verify-email-invalid-token"
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="2x"
          className="mb-2"
        />
        <h2 className="h5 mt-2">Tautan verifikasi tidak valid</h2>
        <p className="mb-3 small">
          Tautan verifikasi email tidak mengandung token yang valid. Silahkan
          minta tautan baru dari halaman resend verifikasi.
        </p>
        <div className="d-flex flex-column gap-2">
          <Link href="/resend-verification" legacyBehavior passHref>
            <WebButton as="a" variant="accent1" className="w-100">
              Minta tautan baru
            </WebButton>
          </Link>
          <Link href="/login" legacyBehavior passHref>
            <WebButton as="a" variant="outline-accent1" className="w-100">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Kembali ke login
            </WebButton>
          </Link>
        </div>
      </Alert>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div
        className="text-center"
        role="status"
        aria-live="polite"
        data-testid="verify-email-success"
      >
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="3x"
          className="text-accent1 mb-3"
        />
        <h2 className="h4 mb-2">Email verified successfully.</h2>
        <p className="text-muted mb-4">Your account is now active.</p>
        <div className="d-flex flex-column gap-2">
          <Link href="/login" legacyBehavior passHref>
            <WebButton as="a" variant="accent1" className="w-100">
              Masuk
            </WebButton>
          </Link>
          <Link href="/m/dashboard" legacyBehavior passHref>
            <WebButton as="a" variant="outline-accent1" className="w-100">
              Buka dashboard
            </WebButton>
          </Link>
        </div>
      </div>
    );
  }

  // Failure path — map the backend's error name to a friendly message.
  const err = mutation.error as any;
  const name = String(err?.name || '');
  const messageMap: Record<string, string> = {
    INVALID_TOKEN:
      'Tautan verifikasi tidak valid atau sudah pernah digunakan. Silahkan minta tautan baru.',
    EXPIRED_TOKEN:
      'Tautan verifikasi sudah kedaluwarsa. Silahkan minta tautan baru.',
    USED_TOKEN:
      'Tautan verifikasi sudah pernah digunakan. Silahkan minta tautan baru.',
  };
  const errMessage =
    messageMap[name] ||
    err?.message ||
    'Gagal memverifikasi email. Silahkan coba lagi.';

  return (
    <Alert
      variant="danger"
      className="text-center mb-0"
      data-testid="verify-email-failed"
    >
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        size="2x"
        className="mb-2"
      />
      <h2 className="h5 mt-2">Verifikasi email gagal</h2>
      <p className="mb-3 small">{errMessage}</p>
      <div className="d-flex flex-column gap-2">
        <Link href="/resend-verification" legacyBehavior passHref>
          <WebButton as="a" variant="accent1" className="w-100">
            Minta tautan baru
          </WebButton>
        </Link>
        <Link href="/login" legacyBehavior passHref>
          <WebButton as="a" variant="outline-accent1" className="w-100">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Kembali ke login
          </WebButton>
        </Link>
      </div>
    </Alert>
  );
}

export default FormMemberVerifyEmail;
