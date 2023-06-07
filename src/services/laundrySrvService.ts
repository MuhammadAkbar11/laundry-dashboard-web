/* eslint-disable no-nested-ternary */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import * as Interfaces from '@interfaces';
import {
  runInDevAsync,
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';

export async function getLaundrySrvPaginationService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<
  Interfaces.ILaundryService[]
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
      `${API_URI}/laundry/service?${queries}`
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

export async function getLaundrySrvService(): Promise<
  Interfaces.ILaundryService[]
> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.get(`${API_URI}/laundry/service`);
    const responseData = data?.laundryService;
    return responseData;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
