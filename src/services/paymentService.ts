import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';

export async function getPaymentsService() {
  // eslint-disable-next-line no-console
  console.log('getPaymentsService');
}

export async function postPaymentService(payload: {
  paidAmount: number;
  laundryQueueId: string;
  promoCode?: string;
}) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const { data } = await axiosPrivate.post(`${API_URI}/payment`, {
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
