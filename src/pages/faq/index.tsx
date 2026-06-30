import React from 'react';
import Head from 'next/head';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import FaqAccordion from '@components/Web/Faq/FaqAccordion';
import { faqCategories } from '@utils/dummyData/faqs';

type Props = {};

function FaqPage({}: Props) {
  const TITLE = `FAQ | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan laundry CusCuciin, pemesanan, pembayaran, jemput-antar, akun member, dan program poin reward."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <PageHeader
        title="FAQ"
        size="sm"
        history={[{ name: 'FAQ', disabled: true }]}
      />
      <FaqAccordion categories={faqCategories} />
    </>
  );
}

FaqPage.layout = WebLayout;

export default FaqPage;
