// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ILaundryItem } from '@interfaces';
import { getLaundryQueueLaundriesService } from '@services/laundryQueueService';
import { useQuery } from '@tanstack/react-query';

const useGetLaundryQueueLaundries = (laundryQueueId: string) =>
  useQuery<unknown, unknown, ILaundryItem[]>(
    ['laundriesData', { laundryQueueId }],
    () => getLaundryQueueLaundriesService(laundryQueueId as string),
    {
      enabled: !!laundryQueueId,
      retryDelay: 5000,
    }
  );

export default useGetLaundryQueueLaundries;
