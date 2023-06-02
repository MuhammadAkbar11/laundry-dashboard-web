import React from 'react';
import Head from 'next/head';
import { APP_NAME } from '@configs/varsConfig';

type Props = {
  statusCode: number;
};

function ErrorServerPage({ statusCode }: Props) {
  const title = `${statusCode || 'Loading...'} | ${APP_NAME}`;

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
                  <h1 className="display-1 font-weight-bold">{statusCode}</h1>
                  <p className="h1">Terjadi Kesalahan pada Server</p>
                  <p className=" font-weight-normal mt-3 mb-4">
                    Maaf, halaman tidak dapat dimuat karena terjadi kesalahan
                    pada server.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ErrorServerPage;
