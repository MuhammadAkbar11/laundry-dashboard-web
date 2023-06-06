import { getLaundrySrvService } from '@services/laundrySrvService';
import { useQuery } from '@tanstack/react-query';

const useGetLaundryServices = () =>
  useQuery({
    queryKey: ['laundryServicesData'],
    queryFn: () => getLaundrySrvService(),
  });

export default useGetLaundryServices;
