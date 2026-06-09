/* eslint-disable no-nested-ternary */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { uQueriesToString, uTranformAxiosError } from '@utils/utils';
import * as Interfaces from '@interfaces';

export async function getAdminMembersService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<Interfaces.IServiceWithPaginateReturn<any> | void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
      : null;
  const orderBy = sorting?.id;
  const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;
  const queries = uQueriesToString({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: orderBy,
    _sortBy: sortingBy,
  });
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/member/members?${queries}`
    );
    const responseData = data?.data;
    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.members,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getAdminMemberByIdService(
  memberId: string
): Promise<any> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/member/members/${memberId}`
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function putAdminMemberService(
  memberId: string,
  payload: Record<string, any>
): Promise<any> {
  try {
    const { data } = await axiosPrivate.put(
      `${API_URI}/member/members/${memberId}`,
      payload
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postAdminMemberResetPasswordService(
  memberId: string
): Promise<{ temporaryPassword: string; message: string }> {
  try {
    const { data } = await axiosPrivate.post(
      `${API_URI}/member/members/${memberId}/reset-password`
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function putAdminMemberAvatarService(
  memberId: string,
  file?: File | null
): Promise<any> {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    const { data } = await axiosPrivate.put(
      `${API_URI}/member/members/${memberId}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
