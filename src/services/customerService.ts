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
  CreateCustomerInputTypes,
  UpdateCustomerInputTypes,
} from '@utils/schema/customerSchema';
import {
  uDelayAsync,
  uQueriesToString,
  uTranformAxiosError,
} from '@utils/utils';

export interface ICustomerLevel {
  customerLevelId: string;
  name: string;
  point: bigint;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomer {
  customerId: string;
  name: string;
  address: string;
  phone: string;
  customerLevelId: string;
  point: number;
  createdAt: string;
  updatedAt: string;
  customerLevel: ICustomerLevel;
  _count?: {
    laundryQueues: number;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserAuth {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  session: string;
}

export async function getCustomersService(
  queryOpt: IPaginationOptions
): Promise<IServiceWithPaginateReturn<ICustomer> | void> {
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
): Promise<{ customer: ICustomer; message: string } | void> {
  try {
    await uDelayAsync(1000);

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
): Promise<{ customer: ICustomer; message: string } | void> {
  try {
    await uDelayAsync(1000);
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
): Promise<{ customer: ICustomer; message: string } | void> {
  try {
    await uDelayAsync(1000);

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
  ICustomerLevel[] | void
> {
  try {
    const { data } = await axiosPrivate.get(`${API_URI}/level/customer`);
    return data?.levels;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
