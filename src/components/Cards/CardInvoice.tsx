import React from 'react';
import { IInvoice, ISetting } from '@interfaces';
import { uDate, uRupiah } from '@utils/utils';
import { Card, Col, Row, Table } from 'react-bootstrap';

type Props = { invoice: IInvoice; setting: ISetting };

function CardInvoice({ invoice, setting }: Props) {
  return (
    <Card className="m-b-30">
      <Card.Body>
        <Row>
          <Col sm={12}>
            <div className="d-flex justify-content-between">
              <h3 className="m-t-0">
                {/* <img src="/images/logo.png" alt="logo" height="40" /> */}
                LOGO
              </h3>
              <h4 className="float-right font-16">
                <strong>Invoice #{invoice.invoice}</strong>
              </h4>
            </div>
            <hr />
            <Row>
              <Col sm={6}>
                <address>
                  <strong>Untuk:</strong>
                  <br />
                  {invoice?.laundryQueue?.customer?.name}
                  <br />
                  <span className="fst-italic">
                    {invoice?.laundryQueue?.customer?.address}
                  </span>
                  <br />
                  {invoice?.laundryQueue?.customer?.phone}
                </address>
              </Col>
              <Col sm={6} className="text-end">
                <address>
                  <strong>Pengiriman :</strong>
                  <br />
                  <span>
                    {invoice?.laundryQueue?.deliveryType === 'PICKUP'
                      ? 'Self Pickup (Antar-Jemput Sendiri)'
                      : 'Delivery (Jemput-Antar)'}
                  </span>{' '}
                  <br />
                  {invoice?.laundryQueue?.deliveryType === 'PICKUP' ? (
                    <span className="fst-italic">
                      {setting?.name?.value}
                      <br />
                      {setting?.alamat?.value}, {setting?.kelurahan?.value}
                      <br />
                      {setting?.kecamatan?.value}, {setting?.kodepos?.value}
                      <br />
                      {setting?.kabupaten?.value}, {setting?.provinsi?.value}
                    </span>
                  ) : (
                    <span className="fst-italic">
                      {invoice?.laundryQueue?.customer?.address}
                    </span>
                  )}
                </address>
              </Col>
            </Row>
            <Row>
              <Col sm={6} className="mt-4">
                <address>
                  <strong>Metode Pembayaran:</strong>
                  <br />
                  {invoice?.paymentMethod === 'CASH' ? 'Uang Tunai' : null}
                  {invoice?.paymentMethod === 'BANK_TRANSFER'
                    ? 'Bank Transfer'
                    : null}
                  <br />
                </address>
              </Col>
              <Col sm={6} className="mt-4 text-end">
                <address>
                  <strong>Tanggal Pesanan:</strong>
                  <br />
                  {uDate(invoice?.laundryQueue?.createdAt, 'short')}
                </address>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="">
              <div className="">
                <h3 className="text-dark">
                  <strong>Ringkasan Pesanan</strong>
                </h3>
              </div>
              <div>
                <div className="table-responsive">
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Layanan</th>
                        <th className="text-center">Harga</th>
                        <th className="text-start" style={{ width: '15%' }}>
                          Jumlah
                        </th>
                        <th className="text-end" style={{ width: '20%' }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice?.laundryQueue?.laundries.map((laundry) => (
                        <tr key={laundry?.laundryId}>
                          <td>{laundry?.historyService?.name}</td>
                          <td className="text-center">
                            {uRupiah(
                              Number(laundry?.historyService?.price || 0)
                            )}
                          </td>
                          <td className="text-start">
                            {laundry?.quantity} {laundry?.historyService?.unit}
                          </td>
                          <td className="text-end">
                            {uRupiah(Number(laundry?.totalPrice))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0 text-start">
                          <strong>Subtotal</strong>
                        </td>
                        <td className="border-0 pb-0 text-end">
                          <h5 className="m-0">
                            {uRupiah(Number(invoice.price))}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0 text-start">
                          <strong>Discount</strong>
                        </td>
                        <td className="border-0 pb-0 text-end">
                          <h5 className="m-0">{uRupiah(invoice.discount)}</h5>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0 text-start">
                          <strong>Total</strong>
                        </td>
                        <td className="border-0 pb-0 text-end">
                          <h5 className="m-0">
                            {uRupiah(Number(invoice.totalPrice))}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0 text-start">
                          <strong>Bayar</strong>
                        </td>
                        <td className="border-0 pb-0 text-end">
                          <h5 className="m-0">
                            {uRupiah(Number(invoice.paid))}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-0 pb-0" />
                        <td className="border-0 pb-0" />

                        <td className="border-0 pb-0 text-start">
                          <strong>Kembali</strong>
                        </td>
                        <td className="border-0 pb-0 text-end">
                          <h5 className="m-0">
                            {uRupiah(Number(invoice.cashback))}
                          </h5>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CardInvoice;
