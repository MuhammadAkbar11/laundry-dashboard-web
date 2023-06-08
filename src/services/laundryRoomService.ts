import { AxiosRequestConfig } from 'axios';
import { API_URI } from '@configs/varsConfig';
import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';
import { axiosPrivate } from '@utils/apiUtils';
import { ILaundryRoom } from '@interfaces';

export async function updateStatusFinishedService(
  payload: Pick<ILaundryRoom, 'laundryRoomId' | 'laundryQueueId'>
): Promise<{ laundryRoom: ILaundryRoom; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.put(
      `${API_URI}/laundry/room/finished/${payload.laundryRoomId}`,
      { laundryQueueId: payload.laundryQueueId }
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getDetailLaundryRoomService(
  payload: string,
  config?: AxiosRequestConfig
): Promise<ILaundryRoom | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/laundry/room/${payload}`,
      config
    );
    return data?.laundryRoom;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
