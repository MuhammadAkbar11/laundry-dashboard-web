import { API_URI } from '@configs/varsConfig';
import { IUserAuth } from '@interfaces';
import { axiosPrivate } from '@utils/apiUtils';
import { SignInInputTypes } from '@utils/schema/authSchema';
import {
  runInDevAsync,
  uConvertKeysToCamelCase,
  uDelayAsync,
  uIsNotEmptyObject,
  uTranformAxiosError,
} from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

export async function postSignInService(payload: SignInInputTypes) {
  try {
    const res = await axiosPrivate.post(`${API_URI}/auth/user/signin`, payload);
    return res.data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getSessionService(
  config?: AxiosRequestConfig
): Promise<IUserAuth | boolean | void> {
  try {
    const response = await axiosPrivate.get(
      `${API_URI}/auth/user/session`,
      config
    );

    const sessionData = response.data?.session;
    return uConvertKeysToCamelCase(sessionData);
  } catch (error) {
    const errRes = uTranformAxiosError(error);
    throw errRes;
    // return false;
  }
}

export async function postSignOutService(config?: AxiosRequestConfig) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const response = await axiosPrivate.post(
      `${API_URI}/auth/user/signout`,
      config
    );
    return response.data;
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}

export async function isAuthenticadedService(
  config?: AxiosRequestConfig
): Promise<boolean> {
  try {
    const response = await axiosPrivate.get(
      `${API_URI}/auth/user/session`,
      config
    );

    const sessionData = response.data?.session;

    return uIsNotEmptyObject(sessionData);
  } catch (error) {
    // const errRes = uTranformAxiosError(error);
    // console.log(errRes.data);
    throw uTranformAxiosError(error);
  }
}
