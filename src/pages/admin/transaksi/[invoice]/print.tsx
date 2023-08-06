/* eslint-disable no-new */
import React from 'react';
// import AdminLayout from '@/layouts/AdminLayout';
import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';
import { APP_NAME } from '@configs/varsConfig';
import { GetServerSidePropsContext } from 'next';
import { getSessionService } from '@services/authSevices';
import {
  uCheckPermissions,
  uGetStatusCode,
  uIsForbiddenError,
  uIsUnauthorizedError,
  uNotAuthRedirect,
  uReplaceURL,
} from '@utils/utils';
import { IInvoice, IPageProps, ISetting, IUserAuth } from '@interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { useRouter } from 'next/router';
import { getPaymentInvoiceService } from '@services/paymentService';
import { useQuery } from '@tanstack/react-query';
import useGetSetting from '@hooks/useGetSetting';
import useMediaQuery from '@hooks/useMediaQuery';
import CardInvoice from '@components/Cards/CardInvoice';

interface Props extends IPageProps {
  invoice: IInvoice;
}

export default function TransaksiInvoicePage({
  userAuth,
  invoice: invoiceInitialData,
}: Props) {
  const router = useRouter();

  const invoiceParam = router.query?.invoice || null;

  const TITLE = `Print Invoice ${invoiceParam} | ${APP_NAME}`;

  const laundryRoomQueryKey = React.useMemo(
    () => ['invoice', { invoice: invoiceParam }],
    [invoiceParam]
  );

  const { data, isSuccess } = useQuery<unknown, unknown, IInvoice>({
    queryKey: laundryRoomQueryKey,
    queryFn: () => getPaymentInvoiceService(invoiceParam as string),
    initialData: invoiceInitialData,
  });

  const { data: settingData, isSuccess: isSuccessSetting } = useGetSetting();

  const userAuthCtx = useUserAuthContext();
  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  React.useEffect(() => {
    if (isSuccess && isSuccessSetting) {
      window.print();
    }
  }, [isSuccess, isSuccessSetting]);

  const lgScreen = useMediaQuery('lg');

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container
        fluid
        className="p-0 overflow-hidden bg-white "
        style={{ height: lgScreen ? '100vh' : 'max-content' }}
      >
        <Row className="">
          <Col xs={12} className="h-100  ">
            <CardInvoice setting={settingData as ISetting} invoice={data} />
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
    const userAuth = (await getSessionService({
      headers,
    })) as IUserAuth;
    if (!userAuth) return uNotAuthRedirect(url);

    const hasPermission = await uCheckPermissions(userAuth, url as string);

    if (!invoiceParam) {
      return {
        redirect: {
          destination: '/transaksi',
          permanent: false,
        },
      };
    }

    const invoice = await getPaymentInvoiceService(invoiceParam as string, {
      headers,
    });

    return {
      props: {
        userAuth,
        invoice,
        isRestricted: !hasPermission,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (uIsUnauthorizedError(err) || uIsForbiddenError(err)) {
      return {
        redirect: {
          destination: `/admin/login?redirect=${url}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        errorCode: uGetStatusCode(err),
        userAuth: null,
      },
    };
  }
}

// TransaksiInvoicePage.layout = AdminLayout;
