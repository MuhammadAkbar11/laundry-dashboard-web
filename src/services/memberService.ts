/* eslint-disable no-nested-ternary */
import { API_URI } from '@configs/varsConfig';
import * as Interfaces from '@interfaces';

import { axiosPrivate } from '@utils/apiUtils';
import {
  MemberOrderInputTypes,
  MemberPaymentInputTypes,
} from '@utils/schema/memberSchema';
import {
  runInDevAsync,
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

export async function getMemberLaundryQueueService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<
  Interfaces.ILaundryQueue[]
> | void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
      : null;

  const orderBy = sorting?.id;
  const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;

  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: orderBy,
    _sortBy: sortingBy,
  });

  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/laundry-queue?${queries}`
    );
    const responseData = data?.data;
    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.laundryQueues,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberLaundryRoomService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<
  Interfaces.IListLaundryRoom[]
> | void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
      : null;

  const orderBy = sorting?.id;
  const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;

  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: orderBy,
    _sortBy: sortingBy,
  });

  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/laundry-room?${queries}`
    );
    const responseData = data?.data;
    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.laundryRooms,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberLaundryRoomDetailService(
  payload: string,
  config?: AxiosRequestConfig
): Promise<Interfaces.ILaundryRoom | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/laundry-room/${payload}`,
      config
    );
    return data?.laundryRoom;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberLaundryQueueDetailService(
  payload: string,
  config?: AxiosRequestConfig
  // ) {
): Promise<Interfaces.ILaundryQueue | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/laundry-queue/${payload}`,
      config
    );
    return data?.laundryQueue;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberLaundryQueueLaundriesService(
  payload: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Interfaces.ILaundryItem[] | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/laundry-queue/${payload}/laundries`
    );
    return data?.laundries;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberTransactionService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IPayment> | void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
      : null;

  const orderBy = sorting?.id;
  const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;

  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: orderBy,
    _sortBy: sortingBy,
  });
  try {
    await runInDevAsync(() => uDelayAsync(1300));

    const { data } = await axiosPrivate.get(
      `${API_URI}/member/transaction?${queries}`
    );
    const responseData = data?.data;
    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.transactions,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postMemberOrderService(payload: MemberOrderInputTypes) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.post(`${API_URI}/member/order`, {
      deliveryType: payload.deliveryType,
      deliveryAddress: payload.deliveryAddress,
      note: payload.note,
      pickupAt: new Date(`${payload.pickupAt.date} ${payload.pickupAt.time}`),
      services: payload.services,
    });
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
export async function updateMemberProfileService(payload: {
  name: string;
  address: string;
  phone: string;
  username: string;
}) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.put(`${API_URI}/member/profile`, {
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      username: payload.username,
    });
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postMemberPaymentService(
  payload: MemberPaymentInputTypes & { laundryQueueId: string }
  // ): Promise<{ user: Interfaces.IUser; message: string } | void> {
) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const payloadFormData = new FormData();
    if (payload.proof) {
      payloadFormData.append('image', payload.proof?.[0]);
    }
    payloadFormData.append('paymentMethod', payload.paymentMethod);
    payloadFormData.append('laundryQueueId', payload.laundryQueueId);
    const { data } = await axiosPrivate.post(
      `${API_URI}/member/payment`,
      payloadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberPaymentInvoiceService(
  payload: string,
  config?: AxiosRequestConfig
): Promise<Interfaces.IInvoice | void> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/transaction-invoice/${payload}`,
      config
    );
    return data?.invoice;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
