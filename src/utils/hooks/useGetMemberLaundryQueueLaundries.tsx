// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ILaundryItem } from '@interfaces';

import { getMemberLaundryQueueLaundriesService } from '@services/memberService';
import { useQuery } from '@tanstack/react-query';

const useGetMemberLaundryQueueLaundries = (laundryQueueId: string) =>
  useQuery<unknown, unknown, ILaundryItem[]>(
    ['memberLaundriesData', { laundryQueueId }],
    () => getMemberLaundryQueueLaundriesService(laundryQueueId as string),
    {
      enabled: !!laundryQueueId,
      retryDelay: 5000,
    }
  );

export default useGetMemberLaundryQueueLaundries;
