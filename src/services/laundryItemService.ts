import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { CreateLaundryItemInputTypes } from '@utils/schema/laundryItemSchema';
import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';

/* eslint-disable import/prefer-default-export */
export function getLaundryService() {}

export async function postOrPutLaundryItemService(
  payload: CreateLaundryItemInputTypes & {
    laundryId?: string;
    laundryQueueId: string;
    type: 'create' | 'update';
  }
) {
  try {
    await runInDevAsync(() => uDelayAsync(666));

    if (payload.type === 'create') {
      const { data: createdData } = await axiosPrivate.post(
        `${API_URI}/laundry/item`,
        {
          serviceId: payload.serviceId,
          quantity: payload.qty,
          note: payload.note,
          laundryQueueId: payload.laundryQueueId,
        }
      );
      return createdData;
    }

    const { data: updatedData } = await axiosPrivate.put(
      `${API_URI}/laundry/item/${payload.laundryId}`,
      {
        serviceId: payload.serviceId,
        quantity: payload.qty,
        note: payload.note,
      }
    );
    return updatedData;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
