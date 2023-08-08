/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
import { IMemberProfile } from '@interfaces';
import { getMemberProfileService } from '@services/profileService';
import { useQuery } from '@tanstack/react-query';

type Props = {
  initialData?: any;
};

const useGetMemberProfile = ({ initialData }: Props) =>
  useQuery<{}, {}, IMemberProfile>({
    queryKey: ['memberProfile'],
    queryFn: () => getMemberProfileService(),
    initialData: initialData || null,
  });

useGetMemberProfile.defaultProps = {
  initialData: null,
};

export default useGetMemberProfile;
