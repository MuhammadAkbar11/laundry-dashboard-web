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

export type AuditLogListFilters = {
  action?: string;
  entityType?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
};

type IAuditLogsQueryOptions = Interfaces.IQueriesOptions & {
  _action?: string;
  _entityType?: string;
  _actorId?: string;
  _startDate?: string;
  _endDate?: string;
};

export async function getAuditLogsService(
  queryOpt: Interfaces.IPaginationOptions & AuditLogListFilters
): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IAuditLog> | void> {
  const sorting =
    queryOpt?.sorting?.length !== 0
      ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
      : null;

  const orderBy = sorting?.id;
  const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;

  const queries = uQueriesToString<IAuditLogsQueryOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
    _search: queryOpt.searchTerm,
    _orderBy: orderBy,
    _sortBy: sortingBy,
    _action: queryOpt.action,
    _entityType: queryOpt.entityType,
    _actorId: queryOpt.actorId,
    _startDate: queryOpt.startDate,
    _endDate: queryOpt.endDate,
  });

  try {
    await runInDevAsync(() => uDelayAsync(1300));

    const { data } = await axiosPrivate.get(
      `${API_URI}/audit-log/all?${queries}`
    );
    const responseData = data?.data;

    return {
      entriesCount: responseData?.totalItems,
      rows: responseData?.auditLogs,
      pageCount: responseData?.totalPages,
    };
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getAuditLogByIdService(
  auditLogId: string
): Promise<Interfaces.IAuditLog | void> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/audit-log/${auditLogId}`
    );
    return data?.auditLog;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
