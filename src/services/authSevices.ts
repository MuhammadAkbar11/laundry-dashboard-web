/* eslint-disable no-console */
import { API_URI } from '@configs/varsConfig';
import { axiosPrivate } from '@utils/apiUtils';
import { SignInInputTypes } from '@utils/schema/authSchema';
import {
  uConvertKeysToCamelCase,
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
    throw uTranformAxiosError(error);
  }
}

export async function getSessionService(
  config?: AxiosRequestConfig
): Promise<IUserAuth | boolean> {
  try {
    const response = await axiosPrivate.get(
      `${API_URI}/auth/user/session`,
      config
    );

    const sessionData = response.data?.session;
    return uConvertKeysToCamelCase(sessionData);
  } catch (error) {
    // const errRes = uTranformAxiosError(error);
    // console.log(errRes.data);
    return false;
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
