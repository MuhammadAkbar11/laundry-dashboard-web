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
import downloadCsvFile from '@utils/downloadCsv';

export async function getExpensesService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IExpenses> | void> {
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
      `${API_URI}/expenses/all?${queries}`
    );
    const responseData = data?.data;

    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.expenses,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function exportExpensesCsvService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
      : null;

  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: sorting?.id,
    _sortBy: sorting ? (!sorting?.desc ? 'asc' : 'desc') : null,
  });

  try {
    await downloadCsvFile(
      axiosPrivate,
      `${API_URI}/expenses/export/csv?${queries}`,
      'expenses.csv'
    );
  } catch (error: unknown) {
    throw uTranformAxiosError(error);
  }
}
export async function getExpensesByIdService(
  expensesId: string
): Promise<Interfaces.IExpenses | void> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/expenses/${expensesId}`
    );
    return data?.expenses;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postExpensesService(payload: {
  description: string;
  total: number;
}): Promise<{ expenses: Interfaces.IExpenses; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.post(
      `${API_URI}/expenses/all`,
      payload
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function putExpensesService(payload: {
  expensesId: string;
  description?: string;
  total?: number;
}): Promise<{ expenses: Interfaces.IExpenses; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const { expensesId, ...updateData } = payload;
    const { data } = await axiosPrivate.put(
      `${API_URI}/expenses/${expensesId}`,
      updateData
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function deleteExpensesService(
  expensesId: string
): Promise<{ expenses: Interfaces.IExpenses; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const { data } = await axiosPrivate.delete(
      `${API_URI}/expenses/${expensesId}`
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
