/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { APP_NAME } from '@configs/varsConfig';
import WebMemberLayout from '@layouts/WebMemberLayout';
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
import MemberTableLaundryRoom from '@components/Web/Tables/MemberTableLaundryRoom';

export default function MemberLaundryPage() {
  const TITLE = `Cucian | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title="Cucian" />
      <MemberTableLaundryRoom />
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

MemberLaundryPage.layout = WebMemberLayout;
