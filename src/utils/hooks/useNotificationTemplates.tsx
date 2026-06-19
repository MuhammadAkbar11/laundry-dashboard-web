import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationTemplateService,
  getNotificationTemplatesService,
  previewNotificationTemplateService,
  resetNotificationTemplateService,
  updateNotificationTemplateService,
} from '@services/notificationTemplateService';
import type { IPaginationOptions } from '@interfaces';

const NOTIFICATION_TEMPLATE_KEYS = {
  list: ['notificationTemplates', 'list'] as const,
  detail: (id: string) => ['notificationTemplates', 'detail', id] as const,
};

export const useNotificationTemplatesList = (pagination: IPaginationOptions) =>
  useQuery({
    queryKey: [...NOTIFICATION_TEMPLATE_KEYS.list, pagination] as const,
    queryFn: () => getNotificationTemplatesService(pagination),
    keepPreviousData: true,
  });

export const useNotificationTemplate = (templateId: string | null) =>
  useQuery({
    enabled: !!templateId,
    queryKey: templateId
      ? NOTIFICATION_TEMPLATE_KEYS.detail(templateId)
      : ['notificationTemplates', 'detail', 'none'],
    queryFn: () => getNotificationTemplateService(templateId as string),
  });

export const useUpdateNotificationTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      payload,
    }: {
      templateId: string;
      payload: { titleTemplate: string; messageTemplate: string };
    }) => updateNotificationTemplateService(templateId, payload),
    onSuccess: (template) => {
      queryClient.invalidateQueries(NOTIFICATION_TEMPLATE_KEYS.list);
      queryClient.invalidateQueries(
        NOTIFICATION_TEMPLATE_KEYS.detail(template.id)
      );
    },
  });
};

export const usePreviewNotificationTemplate = () => {
  return useMutation({
    mutationFn: ({
      templateId,
      payload,
    }: {
      templateId: string;
      payload: { titleTemplate: string; messageTemplate: string };
    }) => previewNotificationTemplateService(templateId, payload),
  });
};

export const useResetNotificationTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) =>
      resetNotificationTemplateService(templateId),
    onSuccess: (template) => {
      queryClient.invalidateQueries(NOTIFICATION_TEMPLATE_KEYS.list);
      queryClient.invalidateQueries(
        NOTIFICATION_TEMPLATE_KEYS.detail(template.id)
      );
    },
  });
};
