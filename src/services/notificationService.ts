import { API_URI } from '@configs/varsConfig';
import * as Interfaces from '@interfaces';
import { axiosPrivate } from '@utils/apiUtils';
import {
  runInDevAsync,
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

export async function getMemberNotificationsService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IMemberNotification> | void> {
  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
  });

  try {
    await runInDevAsync(() => uDelayAsync(600));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/notifications?${queries}`
    );
    const responseData = data?.data;
    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.notifications,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function getMemberUnreadNotificationCountService(
  config?: AxiosRequestConfig
): Promise<number> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/member/notifications/unread-count`,
      config
    );
    return (
      data?.data?.unreadCount ?? data?.unreadCount ?? data?.data ?? data ?? 0
    );
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function markMemberNotificationReadService(
  notificationId: string
) {
  try {
    const { data } = await axiosPrivate.patch(
      `${API_URI}/member/notifications/${notificationId}/read`
    );
    return data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function markAllMemberNotificationsReadService() {
  try {
    const { data } = await axiosPrivate.patch(
      `${API_URI}/member/notifications/read-all`
    );
    return data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function getUserNotificationsService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IUserNotification> | void> {
  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
  });

  try {
    await runInDevAsync(() => uDelayAsync(600));

    const { data } = await axiosPrivate.get(
      `${API_URI}/user/notifications?${queries}`
    );
    const responseData = data?.data;
    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.notifications,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function getUserUnreadNotificationCountService(
  config?: AxiosRequestConfig
): Promise<number> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/user/notifications/unread-count`,
      config
    );
    return (
      data?.data?.unreadCount ?? data?.unreadCount ?? data?.data ?? data ?? 0
    );
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function markUserNotificationReadService(
  notificationId: string
) {
  try {
    const { data } = await axiosPrivate.patch(
      `${API_URI}/user/notifications/${notificationId}/read`
    );
    return data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}

export async function markAllUserNotificationsReadService() {
  try {
    const { data } = await axiosPrivate.patch(
      `${API_URI}/user/notifications/read-all`
    );
    return data;
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}