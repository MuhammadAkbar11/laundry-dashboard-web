/* eslint-disable @typescript-eslint/no-unused-vars */
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

// const dataReportTrx: Interfaces.IReportTrx[] = [
//   {
//     createdAt: '15/07/2023 10:30:45',
//     invoice: 'INV150723001',
//     cashflowType: 'masuk',
//     totalPrice: '1500000',
//   },
//   {
//     createdAt: '17/07/2023 14:20:30',
//     invoice: 'INV170723002',
//     cashflowType: 'keluar',
//     totalPrice: '750000',
//   },
//   {
//     createdAt: '20/07/2023 09:15:22',
//     invoice: 'INV200723003',
//     cashflowType: 'masuk',
//     totalPrice: '2800000',
//   },
//   {
//     createdAt: '22/07/2023 16:45:18',
//     invoice: 'INV220723004',
//     cashflowType: 'keluar',
//     totalPrice: '1200000',
//   },
//   {
//     createdAt: '25/07/2023 11:55:37',
//     invoice: 'INV250723005',
//     cashflowType: 'keluar',
//     totalPrice: '500000',
//   },
//   {
//     createdAt: '27/07/2023 08:10:59',
//     invoice: 'INV270723006',
//     cashflowType: 'masuk',
//     totalPrice: '2200000',
//   },
//   {
//     createdAt: '18/07/2023 13:40:12',
//     invoice: 'INV180723007',
//     cashflowType: 'masuk',
//     totalPrice: '1800000',
//   },
//   {
//     createdAt: '29/07/2023 17:25:50',
//     invoice: 'INV290723008',
//     cashflowType: 'keluar',
//     totalPrice: '900000',
//   },
//   {
//     createdAt: '21/07/2023 10:05:28',
//     invoice: 'INV210723009',
//     cashflowType: 'keluar',
//     totalPrice: '300000',
//   },
//   {
//     createdAt: '23/07/2023 14:50:15',
//     invoice: 'INV230723010',
//     cashflowType: 'masuk',
//     totalPrice: '2500000',
//   },
// ];

// export async function getReportTransactionService(
//   _queryOpt: Interfaces.IPaginationOptions,
//   _typeTrxData?: string
//   // ): Promise<Interfaces.IServiceWithPaginateReturn<Interfaces.IPayment> | void> {
// ) {
//   // const sorting =
//   //   queryOpt?.sorting?.length !== 0
//   //     ? (queryOpt?.sorting?.[0] as Interfaces.IPaginationSorting)
//   //     : null;

//   // const orderBy = sorting?.id;
//   // const sortingBy = sorting ? (!sorting?.desc ? 'asc' : 'desc') : null;

//   // const queries = uQueriesToString<
//   //   Interfaces.IQueriesOptions & { _type?: string }
//   // >({
//   //   _page: queryOpt.pageIndex + 1,
//   //   _limit: queryOpt.pageSize,
//   //   _search: queryOpt.searchTerm,
//   //   _orderBy: orderBy,
//   //   _sortBy: sortingBy,
//   //   _type: typeTrxData,
//   // });
//   try {
//     await runInDevAsync(() => uDelayAsync(1300));

//     // const { data } = await axiosPrivate.get(
//     //   `${API_URI}/payment/all?${queries}`
//     // );
//     // const responseData = data?.data;

//     // return {
//     //   entriesCount: responseData?.totalItems,
//     //   rows: responseData?.[typeTrxData || 'transactions'],
//     //   pageCount: responseData?.totalPages,
//     // };
//     return {
//       entriesCount: dataReportTrx.lastIndexOf,
//       rows: dataReportTrx,
//       pageCount: 1,
//     };
//   } catch (error: unknown) {
//     const err = uTranformAxiosError(error);
//     throw err;
//   }
// }

export async function getReportTrxService<T>(
  type: 'year' | 'month' | 'yearmonth',
  payload?: { year?: string; month?: string }
): Promise<T | void | null> {
  try {
    if (type === 'year') {
      const { data } = await axiosPrivate.get(`${API_URI}/report/transaction`);
      const responseData = data?.data;
      return responseData;
    }

    if (type === 'month') {
      const { data } = await axiosPrivate.get(
        `${API_URI}/report/transaction/${payload?.year}`
      );
      const responseData = data?.data;
      return responseData;
    }

    if (type === 'yearmonth') {
      const { data } = await axiosPrivate.get(
        `${API_URI}/report/transaction/${payload?.year}/${payload?.month}`
      );
      const responseData = data?.data;
      return responseData;
    }

    return null;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export function getReportCashFlowService() {
  return null;
}
