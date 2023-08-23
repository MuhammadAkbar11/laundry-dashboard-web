import React from 'react';
import Head from 'next/head';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import AboutUs from '@components/Web/AboutUs';
import SectionOurServices from '@components/Web/OurServices';
import WorkingProcces from '@components/Web/WorkingProcces';

type Props = {};

function AboutPage({}: Props) {
  const TITLE = `Tentang Kami | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Tentang Kami"
        size="sm"
        history={[{ name: 'Tentang Kami', disabled: true }]}
      />
      <AboutUs />
      <SectionOurServices />
      <WorkingProcces />
    </>
  );
}

AboutPage.layout = WebLayout;

export default AboutPage;
