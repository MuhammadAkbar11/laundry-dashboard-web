import { useQuery } from '@tanstack/react-query';
import { getSettingService } from '../../services/settingService';

const useGetSetting = () =>
  useQuery(['settings'], () => getSettingService(), {
    retryDelay: 5000,
  });

export default useGetSetting;
