import { getLaundrySrvService } from '@services/laundrySrvService';
import { useQuery } from '@tanstack/react-query';

const useGetLaundryServices = () =>
  useQuery({
    queryKey: ['laundryServicesData'],
    queryFn: () => getLaundrySrvService(),
    refetchInterval: 5 * 1000,
  });

export default useGetLaundryServices;
