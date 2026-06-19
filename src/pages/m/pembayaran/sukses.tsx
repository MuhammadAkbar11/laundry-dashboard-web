/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { APP_NAME } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import WebButton from '@components/Buttons/WebButton';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { IMemberAuth, IMemberPageProps } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';

type PageProps = IMemberPageProps;

export default function PaymentSuccesPage({ memberAuth }: PageProps) {
  const TITLE = `Pembayaran Berhasil | ${APP_NAME}`;

  const router = useRouter();
  const laundryQueue = router?.query?.laundryQueue;
  const memberAuthCtx = useMemberAuthContext();

  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Pembayaran Berhasil" />
      <Container className="pb-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} className="text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="6x"
              className="text-success"
            />
            <h2 className="mt-4 fw-bold text-capitalize">
              Terima kasih telah menggunakan jasa kami
            </h2>
            <p className="text-muted">
              Pembayaran Sudah di Terima. Saat ini pembayaran Anda telah masuk
              dan sedang diproses. Mohon tunggu konfirmasi lebih lanjut.
            </p>
            {laundryQueue ? (
              <h5 className="mt-3">No Antrian Anda: {laundryQueue}</h5>
            ) : null}
            <div className="button-group d-flex flex-wrap justify-content-center align-items-center gap-3 mx-auto mt-4">
              <Link href="/m/cucian" legacyBehavior passHref>
                <WebButton
                  variant="success"
                  className="fw-medium text-lg rounded-pill"
                >
                  Lihat Cucian
                </WebButton>
              </Link>
              <Link href="/m/dashboard" legacyBehavior passHref>
                <WebButton
                  variant="outline-success"
                  className="fw-medium text-lg rounded-pill"
                >
                  Dashboard
                </WebButton>
              </Link>
              <WebButton
                className="fw-medium text-lg rounded-pill"
                role="button"
                variant="outline-success"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="me-1" /> WhatsApp
                ke Admin
              </WebButton>
            </div>
          </Col>
        </Row>
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

    return {
      props: {
        memberAuth,
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

PaymentSuccesPage.layout = WebMemberLayout;
