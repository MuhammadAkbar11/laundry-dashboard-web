/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { API_URI, APP_NAME } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
import { GetServerSidePropsContext } from 'next';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { IMemberAuth, IMemberPageProps, IMemberProfile } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { getMemberProfileService } from '@services/profileService';
import { z } from 'zod';
import Image from 'next/image';
// import useMediaQuery from '@hooks/useMediaQuery';
import WebButton from '@components/Buttons/WebButton';
import FeatherIcon from '@components/Icons/FeatherIcon';
import ProfileInvalidWarning from '@components/Alerts/ProfileInvalidWarning';
import useGetMemberProfile from '@hooks/useGetMemberProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMemberProfileService } from '@services/memberService';
import useNotification from '@hooks/useNotification';

type PageProps = IMemberPageProps & { profile: IMemberProfile };

// Define the validation schema using Zod
const schema = z.object({
  username: z.string(),
  // email: z.string().email(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
});

type ProfileFormValues = z.infer<typeof schema>;

export default function MemberProfilePage({
  memberAuth,
  profile: initialProfile,
}: PageProps) {
  const TITLE = `Profil | ${APP_NAME}`;

  const profileQuery = useGetMemberProfile({ initialData: initialProfile });
  const profile = profileQuery?.data;

  const memberAuthCtx = useMemberAuthContext();
  const notif = useNotification();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue } = useForm<ProfileFormValues>({
    defaultValues: {
      username: profile?.username || '',
      // email: profile?.email || '',
      name: profile?.customer.name || '',
      address: profile?.customer.address || '',
      phone: profile?.customer.phone || '',
    },
    resolver: zodResolver(schema),
  });

  const updateProfile = useMutation(updateMemberProfileService, {
    onSuccess: () => {
      queryClient.invalidateQueries(['memberProfile']);
    },
  });

  const onSubmit = (inputs: ProfileFormValues) => {
    updateProfile.mutate(inputs, {
      onSuccess(data: any) {
        notif.success(data?.message || 'Update profile berhasil');
      },
      onError(error: any) {
        const errMessage = error?.name?.includes('AUTH')
          ? error?.message
          : 'Update profile gagal! silahkan coba lagi';
        notif.danger(errMessage);
      },
    });
  };

  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  // const mdScreen = useMediaQuery('md');

  const avatarSize = 200;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Profile" />

      <Container className="pb-5">
        {profileQuery.isLoading ? (
          <Row>
            <Col xs={12} className="text-muted">
              <div
                className="text-center py-5"
                style={{ transform: 'scale(2.5)', fontSize: 18 }}
              >
                <Spinner animation="border" role="status" variant="secondary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            {!profile?.isValidProfile ? (
              <Col xs={{ span: 12, order: 0 }}>
                <div className="pb-3">
                  <ProfileInvalidWarning />
                </div>
              </Col>
            ) : null}
            {/*
            <Col
              md={{ span: 5, order: 2 }}
              className="px-lg-4 d-flex align-items-center align-items-md-start  flex-column gap-2 "
            >
              <div
                style={{
                  width: avatarSize,
                  position: 'relative',
                }}
              >
                <h5 className="fw-bold  ">Gambar Profile</h5>
              </div>
              <div
                style={{
                  height: avatarSize,
                  width: avatarSize,
                  position: 'relative',
                }}
              >
                <Image
                  fill
                  // height={80}
                  // width={80}
                  loading="lazy"
                  src={`${API_URI}${profile?.avatar}`}
                  alt="Avatar"
                  className="rounded-circle "
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="mt-2" style={{ width: avatarSize }}>
                <Button
                  variant="accent1"
                  className="d-flex mx-auto align-items-center gap-2"
                >
                  <FeatherIcon name="Edit" /> Ubah
                </Button>
              </div>
            </Col> */}
            <Col md={{ span: 7, order: 1 }}>
              <Form method="POST" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    {...register('username')}
                    type="text"
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    size="lg"
                    className="py-3"
                    disabled
                    value={profile?.email}
                  />
                </Form.Group>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Nama</Form.Label>
                  <Form.Control
                    {...register('name')}
                    type="text"
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group controlId="address" className="mb-3">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    {...register('address')}
                    size="lg"
                    as="textarea"
                    placeholder="Masukan alamat"
                    className="py-3"
                    rows={3}
                  />
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3">
                  <Form.Label>No Telp</Form.Label>
                  <Form.Control
                    {...register('phone')}
                    type="text"
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group controlId="formJoined" className="mb-4">
                  <Form.Label>Bergabung Pada</Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date(
                      profile?.createdAt || ''
                    ).toLocaleDateString()}
                    disabled
                    className="py-3"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <WebButton isLoading={updateProfile.isLoading} type="submit">
                    Ubah Profil
                  </WebButton>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        )}

        {/* <Row>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Member Profile</Card.Title>

                </Card.Body>
              </Card>
            </Col>
          </Row> */}
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const url = uReplaceURL(ctx.req.url as string);
  try {
    const memberAuth = (await getMemberSessionService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    const profile = await getMemberProfileService({
      headers: { Cookie: cookies, 'User-Agent': userAgent },
    });

    return {
      props: {
        memberAuth,
        profile,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (uIsUnauthorizedError(err) || uIsForbiddenError(err)) {
      return {
        redirect: {
          destination: `/login?redirect=${url}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        errorCode: uGetStatusCode(err),
        memberAuth: null,
      },
    };
  }
}

MemberProfilePage.layout = WebMemberLayout;
