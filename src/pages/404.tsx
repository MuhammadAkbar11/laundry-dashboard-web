import React from 'react';
import MiscLayout from '@/layouts/MiscLayout';
import Link from 'next/link';
import Head from 'next/head';
import BoxButton from '@components/Buttons/BoxButton';

type Props = {};

function Custom404({}: Props) {
  return (
    <>
      <Head>
        <title>404 | AdminKit Demo</title>
      </Head>
      <main className="d-flex w-100 h-100">
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center">
                  <h1 className="display-1 font-weight-bold">404</h1>
                  <p className="h1">Halaman tidak ditemukan</p>
                  <p className="h3 font-weight-normal text-gray mt-3 mb-4">
                    Halaman yang Anda cari tidak dapat di temukan atau mungkin
                    telah dihapus!{' '}
                  </p>
                  <Link href="/" passHref legacyBehavior>
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

Custom404.layout = MiscLayout;

export default Custom404;
