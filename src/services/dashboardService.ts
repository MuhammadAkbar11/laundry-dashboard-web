import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import {
  runInDevAsync,
  uDelayAsync,
  uTranformAxiosError,
} from '@utils/utils';

export async function getAdminDashboardService(period?: string): Promise<any> {
  try {
    await runInDevAsync(() => uDelayAsync(600));
    const { data } = await axiosPrivate.get(`${API_URI}/dashboard/admin${period ? `?period=${period}` : ''}`);
    return data?.data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberDashboardService(): Promise<any> {
  try {
    await runInDevAsync(() => uDelayAsync(600));
    const { data } = await axiosPrivate.get(`${API_URI}/dashboard/member`);
    return data?.data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
