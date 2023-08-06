/* eslint-disable import/prefer-default-export */
import { API_URI } from '@configs/varsConfig';
import { axiosApi } from '@utils/apiUtils';
import * as Interfaces from '@interfaces';
import { uTranformAxiosError } from '@utils/utils';

function settingArrayToObject(
  arr: Interfaces.ISettingItem[]
): Record<string, Partial<Interfaces.ISettingItem>> {
  const obj: Record<string, Partial<Interfaces.ISettingItem>> = {};

  arr.forEach((item) => {
    const { settingId, name, description, value } = item;
    obj[name] = { settingId, name, description, value };
  });

  return obj;
}

export async function getSettingService(): Promise<Interfaces.ISetting | void> {
  try {
    const { data } = await axiosApi.get(`${API_URI}/setting/all`);
    const settingData = data?.settings;
    const settingObj = settingArrayToObject(settingData) as Interfaces.ISetting;
    return settingObj;
  } catch (error: unknown) {
    const err = uTranformAxiosError(error);
    throw err;
  }
}
