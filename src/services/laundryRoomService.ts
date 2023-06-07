import { AxiosRequestConfig } from 'axios';
import { API_URI } from '@configs/varsConfig';
import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';
import { axiosPrivate } from '@utils/apiUtils';
import { ILaundryRoom } from '@interfaces';

export function updateStatusFinishedService() {}

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
