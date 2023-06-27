import { getCustomerLevelDetailService } from '@/services/customerService';
import { useQuery } from '@tanstack/react-query';

const useGetCustomerLevelDetail = (customerLevelId: string) =>
  useQuery({
    queryKey: ['customerLevelDetailData', { customerLevelId }],
    queryFn: () => getCustomerLevelDetailService(customerLevelId),
    enabled: !!customerLevelId,
    retryDelay: 5000,
  });

export default useGetCustomerLevelDetail;
