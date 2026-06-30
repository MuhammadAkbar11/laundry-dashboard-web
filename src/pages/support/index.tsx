import React from 'react';
import Head from 'next/head';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import SupportContent from '@components/Web/Support/SupportContent';

type Props = {};

function SupportPage({}: Props) {
  const TITLE = `Support | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Hubungi tim support CusCuciin melalui WhatsApp, email, atau telepon. Lihat jam operasional dan informasi yang perlu disiapkan sebelum menghubungi support."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <PageHeader
        title="Support"
        size="sm"
        history={[{ name: 'Support', disabled: true }]}
      />
      <SupportContent />
    </>
  );
}

SupportPage.layout = WebLayout;

export default SupportPage;
