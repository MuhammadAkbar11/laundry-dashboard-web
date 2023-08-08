import { ILaundryService } from '@interfaces';
import { getLaundrySrvService } from '@services/laundrySrvService';
import { getPublicLaundrySrvService } from '@services/publicService';
import { useQuery } from '@tanstack/react-query';

const useGetLaundryServices = (type: 'admin' | 'web') =>
  useQuery<{}, {}, ILaundryService[]>({
    queryKey: ['laundryServicesData'],
    queryFn: () =>
      type === 'admin' ? getLaundrySrvService() : getPublicLaundrySrvService(),
    refetchInterval: 10 * 1000,
  });

export default useGetLaundryServices;
