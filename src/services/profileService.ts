import { API_URI } from '@configs/varsConfig';
import { IMemberProfile, IUserAuth } from '@interfaces';
import { axiosPrivate } from '@utils/apiUtils';
import { uConvertKeysToCamelCase, uTranformAxiosError } from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

export async function getMemberProfileService(
  config?: AxiosRequestConfig
): Promise<IMemberProfile | void> {
  try {
    const response = await axiosPrivate.get(
      `${API_URI}/profile/member`,
      config
    );

    const profileData = response.data?.profile;
    return uConvertKeysToCamelCase(profileData);
  } catch (error) {
    const errRes = uTranformAxiosError(error);
    throw errRes;
  }
}

export async function getUserProfileService(
  config?: AxiosRequestConfig
): Promise<IUserAuth | boolean | void> {
  try {
    const response = await axiosPrivate.get(`${API_URI}/profile/user`, config);

    const sessionData = response.data?.profile;
    return uConvertKeysToCamelCase(sessionData);
  } catch (error) {
    const errRes = uTranformAxiosError(error);
    throw errRes;
  }
}
