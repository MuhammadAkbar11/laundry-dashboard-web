/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
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
import { IMemberAuth, IMemberPageProps } from '@interfaces';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import MemberTableLaundryQueue from '@components/Web/Tables/MemberTableLaundryQueue';

type PageProps = IMemberPageProps;

export default function MemberOrdersPage({ memberAuth }: PageProps) {
  const TITLE = `Antrian Pemesanan | ${APP_NAME}`;
  const memberAuthCtx = useMemberAuthContext();
  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Antrian" />
      <MemberTableLaundryQueue />
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

MemberOrdersPage.layout = WebMemberLayout;
