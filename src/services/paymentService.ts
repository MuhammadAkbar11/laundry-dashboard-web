/* eslint-disable no-nested-ternary */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import * as Interfaces from '@interfaces';

import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

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
