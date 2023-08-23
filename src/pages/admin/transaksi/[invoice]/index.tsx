/* eslint-disable no-new */
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
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
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';
import CardInvoice from '@components/Cards/CardInvoice';
import useGetSetting from '@hooks/useGetSetting';

interface Props extends IPageProps {
  invoice: IInvoice;
}

export default function TransaksiInvoicePage({
  userAuth,
  invoice: invoiceInitialData,
}: Props) {
  const router = useRouter();

  const invoiceParam = router.query?.invoice || null;

  const TITLE = `Invoice ${invoiceParam} | ${APP_NAME}`;

  const laundryRoomQueryKey = React.useMemo(
    () => ['invoice', { invoice: invoiceParam }],
    [invoiceParam]
  );

  const { data } = useQuery<unknown, unknown, IInvoice>({
    queryKey: laundryRoomQueryKey,
    queryFn: () => getPaymentInvoiceService(invoiceParam as string),
    initialData: invoiceInitialData,
  });

  const { data: settingData } = useGetSetting();

  const userAuthCtx = useUserAuthContext();
  React.useEffect(() => {
    userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  // console.log(invoice, 'INVOICE');
  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Container fluid className="p-0">
        <div className="d-flex flex-column flex-sm-row justify-content-between ">
          <h1 className="h3 mb-3">Invoice {invoiceParam}</h1>
          <div className="mb-3">
            <div className="">
              <Link href={`/admin/transaksi/${data?.invoice}/print`}>
                <BoxButton
                  icon="Printer"
                  // eslint-disable-next-line no-script-url
                  // href="javascript:window.print()"
                  className="btn btn-success waves-effect waves-light"
                >
                  Print
                </BoxButton>
              </Link>
            </div>
          </div>
        </div>
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
    const userAuth = (await getSessionService({
      headers,
    })) as IUserAuth;
    if (!userAuth) return uNotAuthRedirect(url);

    const hasPermission = await uCheckPermissions(userAuth, url as string);

    if (!invoiceParam) {
      return {
        redirect: {
          destination: '/admin/transaksi',
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

TransaksiInvoicePage.layout = AdminLayout;
