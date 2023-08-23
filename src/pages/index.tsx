/* eslint-disable no-new */
import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import WebLayout from '@layouts/WebLayout';
import HomeCarousel from '@components/Web/HomeCarousel';
import HomeContactInfo from '@components/Web/HomeContactInfo';
import AboutUs from '@components/Web/AboutUs';
import OurServices from '@components/Web/OurServices';
import OurFeatures from '@components/Web/OurFeatures';
import WorkingProcces from '@components/Web/WorkingProcces';
// import OurPricingPlan from '@components/Web/OurPricingPlans';

export default function PagesBlank() {
  const TITLE = `Home | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <HomeCarousel />
      <HomeContactInfo />
      <AboutUs />
      <OurServices />
      <WorkingProcces />
      <OurFeatures />
      {/* <OurPricingPlan /> */}
    </>
  );
}

PagesBlank.layout = WebLayout;
