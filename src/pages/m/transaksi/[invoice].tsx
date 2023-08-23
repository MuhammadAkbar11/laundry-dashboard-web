/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
import { IInvoice, IMemberAuth, IPageProps, ISetting } from '@interfaces';
import MemberPageHeader from '@components/Web/PageHeader/MemberPageHeader';
import { getMemberPaymentInvoiceService } from '@services/memberService';
import { useQuery } from '@tanstack/react-query';
import useGetSetting from '@hooks/useGetSetting';
import { Col, Container, Row } from 'react-bootstrap';
import CardInvoice from '@components/Cards/CardInvoice';
// import useNotification from '@hooks/useNotification';
// import useGetSetting from '@hooks/useGetSetting';

interface Props extends IPageProps {
  invoice: IInvoice;
}

export default function TrxInvoicePage({ invoice: invoiceInitialData }: Props) {
  const router = useRouter();

  const invoiceParam = router.query?.invoice || null;

  const TITLE = `Invoice ${invoiceParam} | ${APP_NAME}`;

  const laundryRoomQueryKey = React.useMemo(
    () => ['member-invoice', { invoice: invoiceParam }],
    [invoiceParam]
  );

  const { data } = useQuery<unknown, unknown, IInvoice>({
    queryKey: laundryRoomQueryKey,
    queryFn: () => getMemberPaymentInvoiceService(invoiceParam as string),
    initialData: invoiceInitialData,
  });

  const { data: settingData } = useGetSetting();

  // const setting = useGetSetting();
  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <MemberPageHeader title={`Invoice ${invoiceParam}`} />
      <Container>
        {' '}
        <Row>
          <Col xs={12}>
            <CardInvoice invoice={data} setting={settingData as ISetting} />
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

  const invoiceParam = ctx.params?.invoice;
  const headers = { Cookie: cookies, 'User-Agent': userAgent };

  try {
    const memberAuth = (await getMemberSessionService({
      headers,
    })) as IMemberAuth;
    if (!memberAuth) return uNotAuthRedirect(url, '/login');

    if (!invoiceParam) {
      return {
        redirect: {
          destination: '/m/transaksi',
          permanent: false,
        },
      };
    }

    const invoice = await getMemberPaymentInvoiceService(
      invoiceParam as string,
      {
        headers,
      }
    );

    return {
      props: {
        memberAuth,
        invoice,
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

TrxInvoicePage.layout = WebMemberLayout;
