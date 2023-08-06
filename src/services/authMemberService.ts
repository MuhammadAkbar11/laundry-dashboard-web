import { API_URI } from '@configs/varsConfig';
import { IMemberAuth } from '@interfaces';
import { axiosPrivate } from '@utils/apiUtils';
import { SignInInputTypes, SignUpInputTypes } from '@utils/schema/authSchema';
import {
  runInDevAsync,
  uConvertKeysToCamelCase,
  uIsNotEmptyObject,
  uDelayAsync,
  uTranformAxiosError,
} from '@utils/utils';
import { AxiosRequestConfig } from 'axios';

export async function postMemberSignInService(payload: SignInInputTypes) {
  try {
    const res = await axiosPrivate.post(
      `${API_URI}/auth/member/signin`,
      payload
    );
    return res.data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function postMemberSignUpService(payload: SignUpInputTypes) {
  try {
    const res = await axiosPrivate.post(
      `${API_URI}/auth/member/signup`,
      payload
    );
    return res.data;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}

export async function getMemberSessionService(
  config?: AxiosRequestConfig
): Promise<IMemberAuth | boolean | void> {
  try {
    const response = await axiosPrivate.get(
      `${API_URI}/auth/member/session`,
      config
    );

    const sessionData = response.data?.session;
    return uConvertKeysToCamelCase(sessionData);
  } catch (error) {
    const errRes = uTranformAxiosError(error);
    throw errRes;
  }
}

export async function isAuthenticadedMemberService(
  config?: AxiosRequestConfig
): Promise<boolean> {
  try {
    const response = await axiosPrivate.get(
      `${API_URI}/auth/member/session`,
      config
    );

    const sessionData = response.data?.session;

    return uIsNotEmptyObject(sessionData);
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}

export async function postMemberSignOutService(config?: AxiosRequestConfig) {
  try {
    await runInDevAsync(() => uDelayAsync(1000));

    const response = await axiosPrivate.post(
      `${API_URI}/auth/member/signout`,
      config
    );
    return response.data;
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}
