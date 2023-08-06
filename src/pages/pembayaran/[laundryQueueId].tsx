/* eslint-disable no-nested-ternary */
/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { APP_NAME } from '@configs/varsConfig';
import {
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { getMemberSessionService } from '@services/authMemberService';
import { IMemberAuth, ILaundryItem, ILaundryQueue } from '@interfaces';
import { useRouter } from 'next/router';
import useNotification from '@hooks/useNotification';
import { getMemberLaundryQueueDetailService } from '@services/memberService';
import { useQuery } from '@tanstack/react-query';
import useGetMemberLaundryQueueLaundries from '@hooks/useGetMemberLaundryQueueLaundries';
import { Container } from 'react-bootstrap';
import WebLayout from '@layouts/WebLayout';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import FormMemberPayment from '@components/Web/Forms/FormMemberPayment';

type Props = {
  laundryQueue: ILaundryQueue;
};

export default function MemberPaymentPage({
  laundryQueue: laundryQueueInitData,
}: Props) {
  const notif = useNotification();
  const router = useRouter();

  const laundryQueueIdParam = router.query?.laundryQueueId;

  const laundryQueueQueryKey = React.useMemo(
    () => ['payLaundryQueueDetail', { laundryQueueId: laundryQueueIdParam }],
    [laundryQueueIdParam]
  );

  const { data: laundryQueue } = useQuery<
    unknown,
    unknown,
    ILaundryQueue & { laundries: ILaundryItem[] }
  >({
    queryKey: laundryQueueQueryKey,
    queryFn: () =>
      getMemberLaundryQueueDetailService(laundryQueueIdParam as string),
    initialData: laundryQueueInitData,
  });

  const laundriesDataQuery = useGetMemberLaundryQueueLaundries(
    laundryQueueIdParam as string
  );

  React.useEffect(() => {
    if (laundriesDataQuery.isError) {
      notif.danger('Gagal mengambil data cucian', {
        id: `laundriesError_${laundryQueueIdParam}`,
      });
    }
  }, [laundriesDataQuery, laundryQueueIdParam, notif]);

  const laundries = laundriesDataQuery?.data as ILaundryItem[];

  const TITLE = `Pembayaran | ${APP_NAME}`;
  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Pembayaran"
        size="sm"
        history={[{ name: 'Pembayaran', disabled: true }]}
      />{' '}
      {/* <MemberTableLaundryRoom /> */}
      <div className="container-fluid bg-white font-opensans py-5  ">
        <Container className="pb-5 px-md-2 px-md-3 h-100">
          <FormMemberPayment
            laundryQueue={laundryQueue}
            laundries={laundries}
          />
        </Container>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userAgent = ctx.req.headers['user-agent'];
  const cookies = ctx.req.headers.cookie;
  const laundryQueueId = ctx.params?.laundryQueueId;

  const headers = { Cookie: cookies, 'User-Agent': userAgent };

  const url = uReplaceURL(ctx.req.url as string);
  try {
    const memberAuth = (await getMemberSessionService({
      headers,
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    const laundryQueue = await getMemberLaundryQueueDetailService(
      laundryQueueId as string,
      { headers }
    );

    if (
      laundryQueue &&
      (laundryQueue?.queuePaymentStatus === 'PROCESSED' ||
        laundryQueue?.queuePaymentStatus === 'FINISHED')
    ) {
      return {
        redirect: {
          destination: `/m/cucian/${laundryQueue?.laundryQueueId}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        memberAuth,
        laundryQueue,
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

MemberPaymentPage.layout = WebLayout;
