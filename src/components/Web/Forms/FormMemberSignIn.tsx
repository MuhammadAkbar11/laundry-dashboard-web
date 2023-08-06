/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInInputTypes, signInSchema } from '@utils/schema/authSchema';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useRouteChangeHandlers from '@hooks/useRouteChangeHandlers';
import { postMemberSignInService } from '@services/authMemberService';
import WebButton from '@components/Buttons/WebButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import useMemberAuth from '@hooks/useMemberAuth';

type Props = {};

function FormMemberSignIn({}: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const notif = useNotification();
  const memberAuth = useMemberAuth();

  const methods = useForm<SignInInputTypes>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation(postMemberSignInService, {
    onSettled() {
      memberAuth.refetchAuth();
    },
  });
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
        notif.success((data?.message as string) || 'Login berhasil');
      },
      onError(error: any) {
        setLoading(false);

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
          className="py-3"
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
        <InputGroup className="mb-3" size="lg">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Masukan kata sandi"
            isInvalid={!!errors?.password}
            className="py-3 border-end-0 "
            autoComplete="on"
            {...register('password')}
          />
          <InputGroup.Text
            id="password"
            className="bg-transparent cursor-pointer border-start-0  "
            onClick={() => {
              setShowPassword((prevSt) => !prevSt);
            }}
          >
            <FontAwesomeIcon icon={!showPassword ? faEye : faEyeSlash} />
          </InputGroup.Text>
        </InputGroup>
        {errors?.password?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.password?.message}
          </Form.Control.Feedback>
        ) : null}

        {/* <div className="mt-2">
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
        </div> */}
      </div>
      <div className="d-flex flex-column mt-4 align-items-center gap-3  ">
        <WebButton
          type="submit"
          size="lg"
          variant="accent1"
          isLoading={loading}
          className="w-100"
        >
          Masuk
        </WebButton>
        <Link href="/daftar" legacyBehavior passHref>
          <WebButton
            as="a"
            size="lg"
            variant="outline-accent1"
            disabled={loading}
            className="w-100"
          >
            Daftar
          </WebButton>
        </Link>
      </div>
    </Form>
  );
}

export default FormMemberSignIn;
