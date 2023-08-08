/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpInputTypes, signUpSchema } from '@utils/schema/authSchema';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useRouteChangeHandlers from '@hooks/useRouteChangeHandlers';
import { postMemberSignUpService } from '@services/authMemberService';
import WebButton from '@components/Buttons/WebButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type Props = {};

function FormMemberSignUp({}: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const notif = useNotification();

  const methods = useForm<SignUpInputTypes>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      username: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation(postMemberSignUpService);
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
    const redirect = router.query?.redirect?.toString() || '/login';

    if (mutation.isSuccess) {
      router.push(redirect);
    }
  }, [mutation.isSuccess, router]);

  const onSubmitHandler = (inputs: SignUpInputTypes) => {
    setLoading(true);
    mutation.mutate(inputs, {
      onSuccess(data) {
        notif.success((data?.message as string) || 'Daftar berhasil');
      },
      onError(error: any) {
        setLoading(false);

        const errMessage = error?.name?.includes('AUTH')
          ? error?.message
          : 'Daftar gagal! Silahkan coba lagi';
        notif.danger(errMessage);
      },
    });
  };

  return (
    <Form method="POST" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-3">
        <Form.Label htmlFor="username">Nama Pengguna</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          id="username"
          placeholder="Masukan Nama Pengguna"
          isInvalid={!!errors?.username}
          className="py-3"
          {...register('username')}
        />
        {errors?.username?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.username?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
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
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="passwordConfirmation">
          Ulangi Kata Sandi
        </Form.Label>
        <Form.Control
          size="lg"
          type={showPassword ? 'text' : 'password'}
          id="passwordConfirmation"
          className="py-3"
          placeholder="Masukan kata sandi"
          isInvalid={!!errors?.passwordConfirmation}
          autoComplete="on"
          {...register('passwordConfirmation')}
        />
        {errors?.passwordConfirmation?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.passwordConfirmation?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="d-flex flex-column mt-4 align-items-center gap-3  ">
        <WebButton
          type="submit"
          size="lg"
          variant="accent1"
          isLoading={loading}
          className="w-100"
        >
          Daftar Sekarang
        </WebButton>
        <Link href="/login" legacyBehavior passHref>
          <WebButton
            as="a"
            size="lg"
            variant="outline-accent1"
            disabled={loading}
            className="w-100"
          >
            Login
          </WebButton>
        </Link>
      </div>
    </Form>
  );
}

export default FormMemberSignUp;
