import { getCustomerLevelsService } from '@/services/customerService';
import { useQuery } from '@tanstack/react-query';
// import React from 'react';

// type Props = {};

const useGetCustomerLevels = () =>
  useQuery({
    queryKey: ['customerLevelsData'],
    queryFn: () => getCustomerLevelsService(),
  });
// const useGetCustomerLevels = () =>
//   useQuery('customerLevels', () => getCustomerLevelsService());

export default useGetCustomerLevels;
