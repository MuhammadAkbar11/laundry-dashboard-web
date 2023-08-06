/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-useless-fragment */
import '@/styles/app.scss';
import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SSRProvider } from 'react-bootstrap';
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';
import ComposeCtxProvider, { ComposeContext } from '@utils/context';
import ToastsWrapper from '@components/Toasts/ToastsWrapper';
import ErrorServerPage from '@components/Utils/ErrorServerPage';
import { APP_NAME } from '@configs/varsConfig';
import RestrictedPage from '@components/Utils/RestrictedPage';
import Error404Page from '@components/Utils/Error404Page';

config.autoAddCss = false;

type NextPageComponentProps = NextPage & {
  providers?: React.ComponentType[];
  layout?: React.ComponentType;
};

type AppPropsWrapp = AppProps & {
  Component: NextPageComponentProps;
};

function SinglePageCtxProvider({
  children,
  providers,
}: {
  children: React.ReactNode;
  providers: React.ElementType[];
}) {
  return <ComposeContext providers={providers}>{children}</ComposeContext>;
}

export default function App({ Component, pageProps }: AppPropsWrapp) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );

  const Layout =
    Component.layout ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>);

  const singlePageProviders = Component.providers ? Component.providers : [];

  let appComponent = (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );

  if (pageProps?.errorCode && pageProps?.errorCode === 500) {
    appComponent = <ErrorServerPage statusCode={pageProps?.errorCode} />;
  }

  if (pageProps?.errorCode && pageProps?.errorCode === 404) {
    appComponent = <Error404Page />;
  }

  if (pageProps?.isRestricted) {
    appComponent = <RestrictedPage />;
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content={APP_NAME} />
        <meta name="author" content="AdminKit" />
        {/* <meta
          name="keywords"
          content="adminkit, bootstrap, bootstrap 5, admin, dashboard, template, responsive, css, sass, html, theme, front-end, ui kit, web"
        /> */}
        <title>{APP_NAME}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SSRProvider>
            <ComposeCtxProvider>
              <SinglePageCtxProvider providers={singlePageProviders}>
                {appComponent}
                <ToastsWrapper />
              </SinglePageCtxProvider>
            </ComposeCtxProvider>
          </SSRProvider>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}
