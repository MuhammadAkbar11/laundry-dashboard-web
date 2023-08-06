import { API_URI } from '@configs/varsConfig';
import { axiosApi } from '@utils/apiUtils';
import * as Interfaces from '@interfaces';
import {
  // runInDevAsync,
  // uDelayAsync,
  // uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';

export async function getPublicSettings() {
  return null;
}

export async function getPublicLaundrySrvService(): Promise<
  Interfaces.ILaundryService[]
> {
  try {
    const { data } = await axiosApi.get(`${API_URI}/public/service`);
    const responseData = data?.laundryService;
    return responseData;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getPublicCustomerLevelDetailService(
  payload: string
): Promise<Interfaces.ICustomerLevel> {
  try {
    const { data } = await axiosApi.get(
      `${API_URI}/public/level/customer/${payload}`
    );
    const responseData = data?.laundryService;
    return responseData;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
