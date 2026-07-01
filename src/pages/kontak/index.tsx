import React from 'react';
import Head from 'next/head';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import ContactContent from '@components/Web/Contact/ContactContent';

type Props = {};

function ContactPage({}: Props) {
  const TITLE = `Kontak Kami | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Hubungi CusCuciin melalui WhatsApp, telepon, email, atau kunjungi lokasi kami. Lihat jam operasional dan kirim pesan langsung kepada tim support."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <PageHeader
        title="Kontak Kami"
        size="sm"
        history={[{ name: 'Kontak Kami', disabled: true }]}
      />
      <ContactContent />
    </>
  );
}

ContactPage.layout = WebLayout;

export default ContactPage;
