/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  CreateUserInputTypes,
  UpdateUserInputTypes,
} from '@utils/schema/userSchema';

export async function getUsersService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IUser> | void> {
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

    const { data } = await axiosPrivate.get(`${API_URI}/user/all?${queries}`);
    const responseData = data?.data;

    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.users,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postUserService(
  payload: CreateUserInputTypes
): Promise<{ customer: Interfaces.IUser; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.post(`${API_URI}/user/all`, payload);
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function putUserService(
  payload: UpdateUserInputTypes & { userId: string }
): Promise<{ user: Interfaces.IUser; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));
    const updateDataPayload = new FormData();
    updateDataPayload.append('image', payload.avatar[0]);
    updateDataPayload.append('email', payload.email);
    updateDataPayload.append('role', payload.role);
    updateDataPayload.append('name', payload.name);
    const { data } = await axiosPrivate.put(
      `${API_URI}/user/${payload.userId}`,
      updateDataPayload,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type header for multipart/form-data
        },
      }
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function deleteUserService(
  payload: string
): Promise<{ user: Interfaces.IUser; message: string } | void> {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const { data } = await axiosPrivate.delete(`${API_URI}/user/${payload}`);
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

// export async function postCustomerService(
//   payload: CreateCustomerInputTypes
// ): Promise<{ customer: Interfaces.ICustomer; message: string } | void> {
//   try {
//     await runInDevAsync(() => uDelayAsync(1000));

//     const { data } = await axiosPrivate.post(
//       `${API_URI}/customer/all`,
//       payload
//     );
//     return data;
//   } catch (error: unknown) {
//     const err = uTranformAxiosError(error);
//     throw err;
//   }
// }
