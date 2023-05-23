/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInInputTypes, signInSchema } from '@utils/schema/authSchema';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { postSignInService } from '@/services/authSevices';
import useNotification from '@hooks/useNotification';
import useRouteChangeHandlers from '@hooks/useRouteChangeHandlers';
import { NODE_ENV } from '@configs/varsConfig';

type Props = {};

function FormSignIn({}: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const notif = useNotification();

  const methods = useForm<SignInInputTypes>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: NODE_ENV === 'development' ? 'superadmin@gmail.com' : '',
      password: NODE_ENV === 'development' ? '123456' : '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation(postSignInService);
  useRouteChangeHandlers({
    routeChangeComplete: () => {
      setLoading(false);
    },
    routeChangeError: () => {
      setLoading(false);
    },
    unsubRouteChangeComplete: false,
    unsubRouteChangeError: false,
  });

  React.useEffect(() => {
    const redirect = router.query?.redirect?.toString() || '/';

    if (mutation.isSuccess) {
      router.push(redirect);
    }
  }, [mutation.isSuccess, router]);

  const onSubmitHandler = (inputs: SignInInputTypes) => {
    setLoading(true);
    mutation.mutate(inputs, {
      onSuccess(data) {
        notif.success(data?.message || 'Login berhasil', { duration: 10000 });
      },
      onError(error: any) {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.log(error);
        const errMessage = error?.name?.includes('AUTH')
          ? error?.message
          : 'Login gagal! silahkan coba lagi';
        notif.danger(errMessage);
      },
    });
  };

  return (
    <Form method="POST" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          size="lg"
          type="email"
          id="email"
          placeholder="Masukan email"
          isInvalid={!!errors?.email}
          {...register('email')}
        />
        {errors?.email?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.email?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="password">Kata Sandi</Form.Label>
        <Form.Control
          size="lg"
          type={showPassword ? 'text' : 'password'}
          id="password"
          placeholder="Masukan kata sandi"
          isInvalid={!!errors?.password}
          autoComplete="on"
          {...register('password')}
        />
        {errors?.password?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.password?.message}
          </Form.Control.Feedback>
        ) : null}
        <div className="mt-2">
          <label className="form-check" style={{ cursor: 'pointer' }}>
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue="remember-me"
              name="remember-me"
              onChange={() => {
                setShowPassword((prevSt) => !prevSt);
              }}
              defaultChecked={showPassword}
            />
            <span className="form-check-label">Tampilkan kata sandi?</span>
          </label>
        </div>
      </div>
      <div className="text-center mt-3">
        <button
          type="submit"
          className="btn btn-lg btn-primary"
          disabled={loading}
        >
          Masuk
        </button>
        {/* <button type="submit" class="btn btn-lg btn-primary">Sign in</button> */}
      </div>
    </Form>
  );
}

export default FormSignIn;
