import React from 'react';
import Head from 'next/head';
import { Container, Row } from 'react-bootstrap';
import clsx from 'classnames';
import CardPricingItem from '@components/Web/Cards/CardPricingItem';
import PageHeader from '@components/Web/PageHeader/PageHeader';
import { APP_NAME } from '@configs/varsConfig';
import useGetLaundryServices from '@hooks/useGetLaundryServices';
import WebLayout from '@layouts/WebLayout';
import { uRupiah } from '@utils/utils';
import useMediaQuery from '@hooks/useMediaQuery';

type Props = {};

function LayananPage({}: Props) {
  const TITLE = `Layanan | ${APP_NAME}`;

  const dataServiceQuery = useGetLaundryServices('web');

  const sm = useMediaQuery('sm-max');
  const md = useMediaQuery('md-min');
  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <PageHeader
        title="Layanan"
        size="sm"
        history={[{ name: 'Layanan', disabled: true }]}
      />
      <div className="container-fluid bg-white font-opensans py-5  ">
        <Container className="pb-5 px-md-2 px-md-3">
          <h6
            className={clsx(
              'text-uppercase text-center fw-semibold text-accent2 mb-3'
            )}
          >
            Layanan Kami
          </h6>
          <h1
            className={clsx('fw-extrabold text-center mb-5 text-accent1 ', {
              'display-6': sm,
              'display-4': md,
            })}
          >
            Jenis Layanan Yang Tersedia
          </h1>
          <Row className="d-flex align-items-stretch">
            {dataServiceQuery?.data
              ? dataServiceQuery?.data.map((item, index) => {
                  const key = index;
                  return (
                    <CardPricingItem
                      key={key}
                      title={item.name}
                      price={`${uRupiah(+item.price)}/${
                        item.unit === 'KG' ? 'Kg' : 'Satuan'
                      }`}
                      variant={index % 2 === 0 ? 'accent2' : 'accent1'}
                      features={[item.description]}
                    />
                  );
                })
              : null}
          </Row>
        </Container>
      </div>
    </>
  );
}

LayananPage.layout = WebLayout;

export default LayananPage;
