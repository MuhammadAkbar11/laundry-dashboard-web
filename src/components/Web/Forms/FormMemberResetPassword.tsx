/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, InputGroup, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ResetPasswordInputTypes,
  resetPasswordSchema,
} from '@utils/schema/authSchema';
import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { postResetPasswordService } from '@services/authMemberService';
import WebButton from '@components/Buttons/WebButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

type Props = {};

function FormMemberResetPassword({}: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resetSucceeded, setResetSucceeded] = React.useState(false);
  const notif = useNotification();

  // Read the token from the URL. router.query is `undefined` on the
  // very first render during SSR, so guard for that. The token is
  // expected to come through as `?token=...`.
  const token = React.useMemo(() => {
    if (!router.isReady) return '';
    const raw = router.query?.token;
    if (Array.isArray(raw)) return raw[0] || '';
    return raw || '';
  }, [router.isReady, router.query?.token]);

  const methods = useForm<ResetPasswordInputTypes>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  React.useEffect(() => {
    if (router.isReady && token) {
      setValue('token', token, { shouldValidate: false });
    }
  }, [router.isReady, token, setValue]);

  const mutation = useMutation(postResetPasswordService);

  React.useEffect(() => {
    if (mutation.isSuccess) {
      setResetSucceeded(true);
      setLoading(false);
    }
  }, [mutation.isSuccess]);

  if (!router.isReady) {
    // First render — avoid flashing a "no token" error.
    return (
      <div
        className="text-center py-4 text-muted"
        role="status"
        aria-live="polite"
      >
        Memuat...
      </div>
    );
  }

  if (!token) {
    return (
      <Alert
        variant="danger"
        className="text-center"
        data-testid="reset-password-invalid-token"
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="2x"
          className="mb-2"
        />
        <h2 className="h5 mt-2">Tautan reset tidak valid</h2>
        <p className="mb-3 small">
          Tautan reset kata sandi tidak mengandung token yang valid. Silahkan
          minta tautan baru dari halaman lupa kata sandi.
        </p>
        <div className="d-flex flex-column gap-2">
          <Link href="/forgot-password" legacyBehavior passHref>
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

  if (resetSucceeded) {
    return (
      <div
        className="text-center"
        role="status"
        aria-live="polite"
        data-testid="reset-password-success"
      >
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="3x"
          className="text-accent1 mb-3"
        />
        <h2 className="h4 mb-2">Password reset successful.</h2>
        <p className="text-muted mb-4">
          You may now sign in with your new password.
        </p>
        <Link href="/login" legacyBehavior passHref>
          <WebButton as="a" variant="accent1" className="w-100">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Sign in
          </WebButton>
        </Link>
      </div>
    );
  }

  const onSubmitHandler = (inputs: ResetPasswordInputTypes) => {
    setLoading(true);
    mutation.mutate(inputs, {
      onError(error: any) {
        setLoading(false);

        const name = String(error?.name || '');
        const messageMap: Record<string, string> = {
          INVALID_TOKEN:
            'Tautan reset tidak valid atau sudah pernah digunakan. Silahkan minta tautan baru.',
          EXPIRED_TOKEN:
            'Tautan reset sudah kedaluwarsa. Silahkan minta tautan baru.',
          USED_TOKEN:
            'Tautan reset sudah pernah digunakan. Silahkan minta tautan baru.',
        };
        const errMessage =
          messageMap[name] ||
          error?.message ||
          'Gagal mengatur ulang kata sandi. Silahkan coba lagi.';
        notif.danger(errMessage);
      },
      onSuccess() {
        notif.success('Kata sandi berhasil diatur ulang.');
      },
    });
  };

  return (
    <Form
      method="POST"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      aria-label="Formulir reset kata sandi"
    >
      <p className="text-muted small mb-4">
        Masukkan kata sandi baru untuk akun Anda. Setelah berhasil, Anda akan
        diarahkan ke halaman login.
      </p>
      <div className="mb-3">
        <Form.Label htmlFor="new-password">Password Baru</Form.Label>
        <InputGroup className="mb-2" size="lg">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            id="new-password"
            placeholder="Masukan password baru"
            isInvalid={!!errors?.newPassword}
            className="py-3 border-end-0"
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors?.newPassword}
            aria-describedby={
              errors?.newPassword ? 'new-password-error' : undefined
            }
            {...register('newPassword')}
          />
          <InputGroup.Text
            className="bg-transparent cursor-pointer border-start-0"
            role="button"
            aria-label={
              showPassword ? 'Sembunyikan password' : 'Tampilkan password'
            }
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={!showPassword ? faEye : faEyeSlash} />
          </InputGroup.Text>
          {errors?.newPassword?.message ? (
            <Form.Control.Feedback
              type="invalid"
              id="new-password-error"
              className="pt-1"
            >
              {errors?.newPassword?.message}
            </Form.Control.Feedback>
          ) : null}
        </InputGroup>
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="confirm-password">Konfirmasi Password</Form.Label>
        <InputGroup className="mb-2" size="lg">
          <Form.Control
            type={showConfirm ? 'text' : 'password'}
            id="confirm-password"
            placeholder="Ulangi password baru"
            isInvalid={!!errors?.confirmPassword}
            className="py-3 border-end-0"
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors?.confirmPassword}
            aria-describedby={
              errors?.confirmPassword ? 'confirm-password-error' : undefined
            }
            {...register('confirmPassword')}
          />
          <InputGroup.Text
            className="bg-transparent cursor-pointer border-start-0"
            role="button"
            aria-label={
              showConfirm ? 'Sembunyikan password' : 'Tampilkan password'
            }
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            <FontAwesomeIcon icon={!showConfirm ? faEye : faEyeSlash} />
          </InputGroup.Text>
          {errors?.confirmPassword?.message ? (
            <Form.Control.Feedback
              type="invalid"
              id="confirm-password-error"
              className="pt-1"
            >
              {errors?.confirmPassword?.message}
            </Form.Control.Feedback>
          ) : null}
        </InputGroup>
      </div>

      <input type="hidden" {...register('token')} />
      <div className="d-flex flex-column mt-4 align-items-center gap-3">
        <WebButton
          type="submit"
          size="lg"
          variant="accent1"
          isLoading={loading}
          disabled={loading}
          className="w-100"
        >
          Atur ulang kata sandi
        </WebButton>
        <Link href="/login" legacyBehavior passHref>
          <WebButton
            as="a"
            size="lg"
            variant="outline-accent1"
            disabled={loading}
            className="w-100"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Kembali ke login
          </WebButton>
        </Link>
      </div>
    </Form>
  );
}

export default FormMemberResetPassword;
