import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { SignInInputTypes } from '@utils/schema/authSchema';
import {
  uConvertKeysToCamelCase,
  uDelayAsync,
  uIsNotEmptyObject,
  uTranformAxiosError,
} from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

export interface IUserAuth {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  session: string;
}

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
    // console.log(errRes.data);
    throw errRes;
    // return false;
  }
}

export async function postSignOutService(config?: AxiosRequestConfig) {
  try {
    await uDelayAsync(1000);
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
    return false;
  }
}
