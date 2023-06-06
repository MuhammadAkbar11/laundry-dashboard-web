import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { CreateLaundryItemInputTypes } from '@utils/schema/laundryItemSchema';
import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';

/* eslint-disable import/prefer-default-export */
export function getLaundryService() {}

export async function postLaundryItemService(
  payload: CreateLaundryItemInputTypes & { laundryQueueId: string }
) {
  try {
    await runInDevAsync(() => uDelayAsync(666));

    const { data } = await axiosPrivate.post(`${API_URI}/laundry/item`, {
      serviceId: payload.serviceId,
      quantity: payload.qty,
      note: payload.note,
      laundryQueueId: payload.laundryQueueId,
    });
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
