/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgotPasswordInputTypes,
  forgotPasswordSchema,
} from '@utils/schema/authSchema';
import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { postForgotPasswordService } from '@services/authMemberService';
import WebButton from '@components/Buttons/WebButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

type Props = {};

function FormMemberForgotPassword({}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState<string>('');
  const notif = useNotification();

  const methods = useForm<ForgotPasswordInputTypes>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation(postForgotPasswordService);

  React.useEffect(() => {
    if (mutation.isSuccess) {
      setSubmitted(true);
      setLoading(false);
    }
  }, [mutation.isSuccess]);

  const onSubmitHandler = (inputs: ForgotPasswordInputTypes) => {
    setLoading(true);
    setSubmittedEmail(inputs.email);
    mutation.mutate(inputs, {
      onError(error: any) {
        setLoading(false);
        const errMessage =
          error?.message || 'Gagal mengirim email reset. Silahkan coba lagi.';
        notif.danger(errMessage);
      },
      onSuccess() {
        notif.success(
          'Jika akun untuk email tersebut ada, kami telah mengirim instruksi reset kata sandi.'
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
        data-testid="forgot-password-success"
      >
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="3x"
          className="text-accent1 mb-3"
        />
        <h2 className="h4 mb-3">Periksa email Anda</h2>
        <p className="text-muted mb-1">
          Jika akun untuk email <strong>{submittedEmail}</strong> ada, kami
          telah mengirim tautan untuk mengatur ulang kata sandi.
        </p>
        <p className="text-muted small mb-4">
          Tautan akan kedaluwarsa dalam 30 menit. Jika Anda tidak menerima
          email, periksa folder spam atau coba lagi beberapa saat.
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
      aria-label="Formulir lupa kata sandi"
    >
      <p className="text-muted small mb-4">
        Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk
        mengatur ulang kata sandi Anda.
      </p>
      <div className="mb-3">
        <Form.Label htmlFor="forgot-email">Email</Form.Label>
        <Form.Control
          size="lg"
          type="email"
          id="forgot-email"
          placeholder="Masukan email"
          isInvalid={!!errors?.email}
          className="py-3"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? 'forgot-email-error' : undefined}
          {...register('email')}
        />
        {errors?.email?.message ? (
          <Form.Control.Feedback
            type="invalid"
            id="forgot-email-error"
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
          Kirim tautan reset
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

export default FormMemberForgotPassword;
