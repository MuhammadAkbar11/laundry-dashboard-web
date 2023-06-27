/* eslint-disable no-nested-ternary */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import * as Interfaces from '@interfaces';
import {
  CreateCustomerInputTypes,
  UpdateCustomerInputTypes,
} from '@utils/schema/customerSchema';
import {
  runInDevAsync,
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';

export async function getCustomersService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.ICustomer> | void> {
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
      `${API_URI}/customer/all?${queries}`
    );
    const responseData = data?.data;

    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.customers,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postCustomerService(
  payload: CreateCustomerInputTypes
): Promise<{ customer: Interfaces.ICustomer; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.post(
      `${API_URI}/customer/all`,
      payload
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function putCustomerService(
  payload: UpdateCustomerInputTypes
): Promise<{ customer: Interfaces.ICustomer; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const updateData: Omit<UpdateCustomerInputTypes, 'customerId'> = {
      customerLevelId: payload.customerLevelId,
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      point: payload.point,
    };

    const { data } = await axiosPrivate.put(
      `${API_URI}/customer/${payload.customerId}`,
      updateData
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function deleteCustomerService(
  payload: string
): Promise<{ customer: Interfaces.ICustomer; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.delete(
      `${API_URI}/customer/${payload}`
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getCustomerLevelsService(): Promise<
  Interfaces.ICustomerLevel[] | void
> {
  try {
    const { data } = await axiosPrivate.get(`${API_URI}/level/customer`);
    return data?.levels;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getCustomerLevelDetailService(
  payload: string
): Promise<Interfaces.ICustomerLevel | void> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/level/customer/${payload}`
    );
    return data?.level;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
