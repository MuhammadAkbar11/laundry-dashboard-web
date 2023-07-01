/* eslint-disable no-nested-ternary */
import { AxiosRequestConfig } from 'axios';
import * as Interfaces from '@interfaces';
import { API_URI } from '@configs/varsConfig';
import {
  runInDevAsync,
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';
import { axiosPrivate } from '@utils/apiUtils';

export async function getLaundryRoomService(
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
      `${API_URI}/laundry/room?${queries}`
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

export async function updateStatusFinishedService(
  payload: Pick<Interfaces.ILaundryRoom, 'laundryRoomId' | 'laundryQueueId'>
): Promise<{ laundryRoom: Interfaces.ILaundryRoom; message: string } | void> {
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
): Promise<Interfaces.ILaundryRoom | void> {
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
