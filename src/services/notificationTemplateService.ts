import { API_URI } from '@configs/varsConfig';
import * as Interfaces from '@interfaces';
import { axiosPrivate } from '@utils/apiUtils';
import { uQueriesToString, uTranformAxiosError } from '@utils/utils';

export interface INotificationTemplateSupportedVariable {
  name: string;
}

export async function getNotificationTemplatesService(
  queryOpt: Interfaces.IPaginationOptions
): Promise<
  | (Interfaces.IServiceWithPaginateReturn<Interfaces.INotificationTemplate> & {
      totalItems: number;
      totalPages: number;
    })
  | void
> {
  const queries = uQueriesToString<Interfaces.IQueriesOptions>({
    _page: queryOpt.pageIndex + 1,
    _limit: queryOpt.pageSize,
  });

  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/notification/template/all?${queries}`
    );
    const d = data?.data ?? {};
    return {
      rows: d.templates ?? [],
      entriesCount: d.totalItems ?? 0,
      pageCount: d.totalPages ?? 0,
      totalItems: d.totalItems ?? 0,
      totalPages: d.totalPages ?? 0,
    };
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}

export async function getNotificationTemplateService(
  templateId: string
): Promise<Interfaces.INotificationTemplate> {
  try {
    const { data } = await axiosPrivate.get(
      `${API_URI}/notification/template/${templateId}`
    );
    return data?.template;
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}

export async function updateNotificationTemplateService(
  templateId: string,
  payload: { titleTemplate: string; messageTemplate: string }
): Promise<Interfaces.INotificationTemplate> {
  try {
    const { data } = await axiosPrivate.put(
      `${API_URI}/notification/template/${templateId}`,
      payload
    );
    return data?.template;
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}

export async function previewNotificationTemplateService(
  templateId: string,
  payload: { titleTemplate: string; messageTemplate: string }
): Promise<{ title: string; message: string; variablesUsed: string[] }> {
  try {
    const { data } = await axiosPrivate.post(
      `${API_URI}/notification/template/${templateId}/preview`,
      payload
    );
    return data?.preview;
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}

export async function resetNotificationTemplateService(
  templateId: string
): Promise<Interfaces.INotificationTemplate> {
  try {
    const { data } = await axiosPrivate.post(
      `${API_URI}/notification/template/${templateId}/reset`
    );
    return data?.template;
  } catch (error) {
    throw uTranformAxiosError(error);
  }
}
