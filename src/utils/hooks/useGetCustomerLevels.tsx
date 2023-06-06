import { getCustomerLevelsService } from '@/services/customerService';
import { useQuery } from '@tanstack/react-query';

const useGetCustomerLevels = () =>
  useQuery({
    queryKey: ['customerLevelsData'],
    queryFn: () => getCustomerLevelsService(),
  });

export default useGetCustomerLevels;
