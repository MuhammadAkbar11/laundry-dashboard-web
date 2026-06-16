import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { runInDevAsync, uDelayAsync, uTranformAxiosError } from '@utils/utils';

export async function getAdminDashboardService(period?: string): Promise<any> {
  try {
    await runInDevAsync(() => uDelayAsync(600));
    const { data } = await axiosPrivate.get(
      `${API_URI}/dashboard/admin${period ? `?period=${period}` : ''}`
    );
    return data?.data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getRevenueAnalyticsService(period: string): Promise<any> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/dashboard/admin/revenue-analytics?period=${period}`
    );
    return data?.data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function getFinancialAnalyticsService(
  period: string
): Promise<any> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/dashboard/admin/financial-analytics?period=${period}`
    );
    return data?.data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function getRevenueByServiceService(period: string): Promise<any> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/dashboard/admin/revenue-by-service?period=${period}`
    );
    return data?.data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
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
