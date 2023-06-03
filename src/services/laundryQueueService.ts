/* eslint-disable no-nested-ternary */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import {
  IPaginationOptions,
  IPaginationSorting,
  IQueriesOptions,
  IServiceWithPaginateReturn,
} from '@utils/interfaces';
import {
  CreateLaundryQueueInputTypes,
  CreateLaundryQueueWithCustomerInputTypes,
} from '@utils/schema/laundryQueueSchema';
import {
  runInDevAsync,
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';
import { CreateCustomerInputTypes } from '@utils/schema/customerSchema';
import { ICustomer } from './customerService';
import { IUserAuth } from './authSevices';
import { ILaundryRoom } from './laundryRoomService';

export type LaundryQueuePaymentStatusType = 'PENDING' | 'FINISHED';
export type LaundryQueueStatusType = 'ONHOLD' | 'FINISHED' | 'WASHED';

export interface ILaundryQueue {
  laundryQueueId: string;
  queuePaymentStatus: LaundryQueuePaymentStatusType;
  status: LaundryQueueStatusType;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  userId: string;
  deliveryAt: string | null;
  deliveryType: string;
  note: string;
  customer: Omit<ICustomer, 'customerLevel' | '_count'>;
  user: Omit<IUserAuth, 'session'>;
  laundryRooms?: Pick<
    ILaundryRoom,
    | 'laundryRoomId'
    | 'total'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'userId'
    | 'laundryQueueId'
  >;
  _count: { laundries: number };
}

export async function getLaundryQueueService(
  queryOpt: IPaginationOptions
): Promise<IServiceWithPaginateReturn<ILaundryQueue[]> | void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as IPaginationSorting)
      : null;

  const orderBy = sorting?.id;
  const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;

  const queries = uQueriesToString<IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: orderBy,
    _sortBy: sortingBy,
  });

  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/laundry/queue?${queries}`
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

export async function postLaundryQueueAndCustomerService(
  payload: CreateLaundryQueueWithCustomerInputTypes
) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    // const { data } = await axiosPrivate.post(
    //   `${API_URI}/laundry/queue`,
    //   payload
    // );

    const customerPayload: CreateCustomerInputTypes = {
      name: payload?.name,
      customerLevelId: payload.customerLevelId,
      phone: payload.phone,
      point: payload.point,
      address: payload.address,
    };

    const { data: customerData } = await axiosPrivate.post(
      `${API_URI}/customer/all`,
      customerPayload
    );

    const customerId = customerData?.customer?.customerId;

    if (!customerId) {
      throw new Error(
        'Berhasil menambahkan data pelanggan tapi gagal membuat antrian'
      );
    }

    const queuePayload: CreateLaundryQueueInputTypes = {
      note: payload.note,
      deliveryType: payload.deliveryType,
      customerId,
    };

    const { data } = await axiosPrivate.post(
      `${API_URI}/laundry/queue`,
      queuePayload
    );

    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postLaundryQueueService(
  payload: CreateLaundryQueueInputTypes
) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.post(
      `${API_URI}/laundry/queue`,
      payload
    );

    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function deleteLaundryQueueService(
  payload: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ message: string; [key: string]: any } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.delete(
      `${API_URI}/laundry/queue/${payload}`
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getDetailLaundryQueueService(
  payload: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ILaundryQueue | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(
      `${API_URI}/laundry/queue/${payload}`
    );
    return data?.laundryQueue;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
