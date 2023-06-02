import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState, SortingState } from '@tanstack/react-table';

interface FetchDataOptions {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  searchTerm: string;
}

interface UseDataQueryProps<TData> {
  // queryFn: QueryFunction<TData, [string, FetchDataOptions]>;
  queryKeyPrefix: string;
  queryFn: (options: FetchDataOptions) => void;
  defaultData: TData[];
  defaultSorting: SortingState;
  defaultPagination?: PaginationState;
}

function useDataQuery<TData>({
  queryKeyPrefix,
  queryFn,
  defaultSorting,
  defaultPagination,
  defaultData,
}: UseDataQueryProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(
    defaultPagination || {
      pageIndex: 0,
      pageSize: 10,
    }
  );

  const fetchDataOptions = useMemo<FetchDataOptions>(
    () => ({
      pageIndex,
      pageSize,
      sorting,
      searchTerm: globalFilter,
    }),
    [globalFilter, sorting, pageIndex, pageSize]
  );

  const fetchQueryKey = useMemo(
    () => [queryKeyPrefix, fetchDataOptions],
    [fetchDataOptions, queryKeyPrefix]
  );

  const dataQuery = useQuery<unknown, unknown, TData>(
    fetchQueryKey,
    () => queryFn(fetchDataOptions),
    {
      keepPreviousData: true,
    }
  );

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  return {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    dataQuery,
    defaultData,
    fetchQueryKey,
  };
}

useDataQuery.defaultProps = {
  defaultPagination: {
    pageIndex: 0,
    pageSize: 10,
  },
};

export default useDataQuery;
