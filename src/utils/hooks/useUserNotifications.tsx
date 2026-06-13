import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserNotificationsService,
  getUserUnreadNotificationCountService,
  markAllUserNotificationsReadService,
  markUserNotificationReadService,
} from '@services/notificationService';
import type { IPaginationOptions } from '@interfaces';

const NOTIFICATION_QUERY_KEYS = {
  list: ['userNotifications', 'list'] as const,
  unread: ['userNotifications', 'unreadCount'] as const,
};

export const useUserUnreadNotificationCount = () =>
  useQuery<number>({
    queryKey: NOTIFICATION_QUERY_KEYS.unread,
    queryFn: () => getUserUnreadNotificationCountService(),
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

export const useUserNotificationsList = (pagination: IPaginationOptions) =>
  useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEYS.list, pagination] as const,
    queryFn: () => getUserNotificationsService(pagination),
    keepPreviousData: true,
  });

export const useMarkUserNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      markUserNotificationReadService(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.unread);
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.list);
    },
  });
};

export const useMarkAllUserNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllUserNotificationsReadService(),
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.unread);
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.list);
    },
  });
};