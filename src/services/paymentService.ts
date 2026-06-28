/* eslint-disable no-nested-ternary */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import * as Interfaces from '@interfaces';

import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';
import { AxiosRequestConfig } from 'axios';
import downloadCsvFile from '@utils/downloadCsv';

export async function getPaymentInvoiceService(
  payload: string,
  config?: AxiosRequestConfig
): Promise<Interfaces.IInvoice | void> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/payment/${payload}`,
      config
    );
    return data?.invoice;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function exportPaymentsCsvService(payload: {
  searchTerm?: string;
  orderBy?: string | null;
  sortBy?: string | null;
  type?: 'transactions' | 'histories';
}) {
  const params = new URLSearchParams();
  if (payload.searchTerm) params.set('_search', payload.searchTerm);
  if (payload.orderBy) params.set('_orderBy', payload.orderBy);
  if (payload.sortBy) params.set('_sortBy', payload.sortBy);
  if (payload.type) params.set('_type', payload.type);

  try {
    await downloadCsvFile(
      axiosPrivate,
      `${API_URI}/payment/export/csv?${params.toString()}`,
      'transactions.csv'
    );
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}
export async function postPaymentService(payload: {
  paidAmount: number;
  laundryQueueId: string;
  promoCode?: string;
}) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const { data } = await axiosPrivate.post(`${API_URI}/payment/all`, {
      paidAmount: Number(payload.paidAmount),
      laundryQueueId: payload.laundryQueueId,
      promoCode: payload.promoCode,
      paymentMethod: 'CASH',
    });
    return data;
    // eslint-disable-next-line no-console
    // console.log(payload);
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postRespondPaymentService(payload: {
  paymentId: string;
  type: string;
}) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const { data } = await axiosPrivate.post(
      `${API_URI}/payment/${payload.paymentId}/respond`,
      { type: payload.type }
    );
    // eslint-disable-next-line no-console
    return data;
    // eslint-disable-next-line no-console
    // console.log(payload);
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
