import React from 'react';
import clsx from 'classnames';
import MiscLayout from '@/layouts/MiscLayout';
import Link from 'next/link';
import Head from 'next/head';
import BoxButton from '@components/Buttons/BoxButton';
import { APP_NAME } from '@configs/varsConfig';
import { useRouter } from 'next/router';
import WebButton from '@components/Buttons/WebButton';

type Props = {};

function Error404Page({}: Props) {
  const TITLE = `404 | ${APP_NAME}`;

  const [adminButton, setAdminBtn] = React.useState(false);

  const router = useRouter();
  const { asPath: path } = router;

  React.useEffect(() => {
    if (path?.includes('/admin')) {
      setAdminBtn(true);
    }
  }, [path]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <main
        className={clsx('d-flex w-100 h-100 bg-transparent', {
          'bg-white': !adminButton,
        })}
      >
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center">
                  <h1 className="display-1 font-weight-bold">404</h1>
                  <p className="h1">Halaman tidak ditemukan</p>
                  <p className="h3 font-weight-normal text-gray   mt-3 mb-4">
                    Halaman yang Anda cari tidak dapat di temukan atau mungkin
                    telah dihapus!{' '}
                  </p>
                  {adminButton ? (
                    <Link href="/admin" passHref legacyBehavior>
                      <BoxButton icon="Home" size="lg" className="py-2" as="a">
                        Kembali ke halaman dashboard
                      </BoxButton>
                    </Link>
                  ) : (
                    <Link href="/" passHref legacyBehavior>
                      <WebButton as="a" variant="accent1" size="lg">
                        Kembali ke Home
                      </WebButton>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

Error404Page.layout = MiscLayout;

export default Error404Page;
