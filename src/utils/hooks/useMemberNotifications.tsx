import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMemberNotificationsService,
  getMemberUnreadNotificationCountService,
  markAllMemberNotificationsReadService,
  markMemberNotificationReadService,
} from '@services/notificationService';
import type { IPaginationOptions } from '@interfaces';

const NOTIFICATION_QUERY_KEYS = {
  list: ['memberNotifications', 'list'] as const,
  unread: ['memberNotifications', 'unreadCount'] as const,
};

export const useMemberUnreadNotificationCount = () =>
  useQuery<number>({
    queryKey: NOTIFICATION_QUERY_KEYS.unread,
    queryFn: () => getMemberUnreadNotificationCountService(),
    // Poll every minute so the bell updates even when the user is
    // idle. The mark-read mutations also invalidate this query
    // synchronously, so the polling is only a fallback.
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

export const useMemberNotificationsList = (pagination: IPaginationOptions) =>
  useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEYS.list, pagination] as const,
    queryFn: () => getMemberNotificationsService(pagination),
    keepPreviousData: true,
  });

export const useMarkMemberNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      markMemberNotificationReadService(notificationId),
    onSuccess: () => {
      // The single notification is now read; refresh both the list
      // (so its read flag updates) and the unread count.
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.unread);
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.list);
    },
  });
};

export const useMarkAllMemberNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllMemberNotificationsReadService(),
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.unread);
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.list);
    },
  });
};
