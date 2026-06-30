import React from 'react';
import Head from 'next/head';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import HelpGuides from '@components/Web/Help/HelpGuides';
import { guideSections } from '@utils/dummyData/guides';

type Props = {};

function HelpPage({}: Props) {
  const TITLE = `Bantuan | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Panduan lengkap menggunakan platform laundry CusCuciin: cara mendaftar, membuat pesanan, melacak laundry, pembayaran, jemput-antar, dashboard member, notifikasi, dan poin reward."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <PageHeader
        title="Bantuan"
        size="sm"
        history={[{ name: 'Bantuan', disabled: true }]}
      />
      <HelpGuides sections={guideSections} />
    </>
  );
}

HelpPage.layout = WebLayout;

export default HelpPage;
