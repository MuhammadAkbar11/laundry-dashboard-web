import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';
import FeatherIcon from '@components/Icons/FeatherIcon';
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';

function RestrictedPage() {
  const title = `Blocked | ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="d-flex w-100 h-100">
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center">
                  <div className="display-1 font-weight-bold pb-3 text-dark">
                    <FeatherIcon width={100} height={100} name="Lock" />
                  </div>
                  <p className="h1">
                    Anda tidak memiliki izin untuk melihat halaman ini
                  </p>
                  <p className=" font-weight-normal mt-3 mb-4">
                    Silahkan memeriksa kembali izin akses yang Anda miliki atau
                    menghubungi administrator sistem untuk mendapatkan bantuan
                    yang diperlukan.
                  </p>
                  <Link href="/admin" passHref legacyBehavior>
                    <BoxButton icon="Home" size="lg" className="py-2">
                      Kembali ke halaman dashboard
                    </BoxButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default RestrictedPage;
