/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ResendVerificationInputTypes,
  resendVerificationSchema,
} from '@utils/schema/authSchema';
import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { postResendVerificationService } from '@services/authMemberService';
import WebButton from '@components/Buttons/WebButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

type Props = {};

function FormMemberResendVerification({}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState<string>('');
  const notif = useNotification();

  const methods = useForm<ResendVerificationInputTypes>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: '' },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation(postResendVerificationService);

  React.useEffect(() => {
    if (mutation.isSuccess) {
      setSubmitted(true);
      setLoading(false);
    }
  }, [mutation.isSuccess]);

  const onSubmitHandler = (inputs: ResendVerificationInputTypes) => {
    setLoading(true);
    setSubmittedEmail(inputs.email);
    mutation.mutate(inputs, {
      onError(error: any) {
        setLoading(false);
        const errMessage =
          error?.message ||
          'Gagal mengirim email verifikasi. Silahkan coba lagi.';
        notif.danger(errMessage);
      },
      onSuccess() {
        notif.success(
          'Jika akun untuk email tersebut ada dan belum terverifikasi, kami telah mengirim tautan verifikasi baru.'
        );
      },
    });
  };

  if (submitted) {
    return (
      <div
        className="text-center"
        role="status"
        aria-live="polite"
        data-testid="resend-verification-success"
      >
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="3x"
          className="text-accent1 mb-3"
        />
        <h2 className="h4 mb-3">Periksa email Anda</h2>
        <p className="text-muted mb-1">
          Jika akun untuk email <strong>{submittedEmail}</strong> ada dan belum
          diverifikasi, kami telah mengirim tautan verifikasi baru.
        </p>
        <p className="text-muted small mb-4">
          Tautan akan kedaluwarsa dalam 24 jam. Jika Anda tidak menerima email,
          periksa folder spam atau coba lagi beberapa saat.
        </p>
        <div className="d-flex flex-column gap-2">
          <Link href="/login" legacyBehavior passHref>
            <WebButton as="a" variant="accent1" className="w-100">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Kembali ke halaman login
            </WebButton>
          </Link>
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => {
              setSubmitted(false);
              setSubmittedEmail('');
              methods.reset();
            }}
          >
            Kirim ulang ke email lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form
      method="POST"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      aria-label="Formulir kirim ulang email verifikasi"
    >
      <p className="text-muted small mb-4">
        Masukkan email yang terdaftar. Kami akan mengirimkan tautan verifikasi
        baru jika akun Anda belum diverifikasi.
      </p>
      <div className="mb-3">
        <Form.Label htmlFor="resend-verification-email">Email</Form.Label>
        <Form.Control
          size="lg"
          type="email"
          id="resend-verification-email"
          placeholder="Masukan email"
          isInvalid={!!errors?.email}
          className="py-3"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors?.email}
          aria-describedby={
            errors?.email ? 'resend-verification-email-error' : undefined
          }
          {...register('email')}
        />
        {errors?.email?.message ? (
          <Form.Control.Feedback
            type="invalid"
            id="resend-verification-email-error"
            className="pt-1"
          >
            {errors?.email?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="d-flex flex-column mt-4 align-items-center gap-3">
        <WebButton
          type="submit"
          size="lg"
          variant="accent1"
          isLoading={loading}
          disabled={loading}
          className="w-100"
        >
          Kirim ulang tautan verifikasi
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

export default FormMemberResendVerification;
