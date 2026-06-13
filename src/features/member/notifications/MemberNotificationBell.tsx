/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { Badge, Dropdown, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {
  useMarkAllMemberNotificationsRead,
  useMarkMemberNotificationRead,
  useMemberNotificationsList,
  useMemberUnreadNotificationCount,
} from '@hooks/useMemberNotifications';
import type { IPaginationOptions } from '@interfaces';
import {
  MemberNotificationEmptyRow,
  MemberNotificationErrorRow,
  MemberNotificationItem,
  MemberNotificationLoadingRow,
} from './MemberNotificationItem';

type Props = {};

const DROPDOWN_PAGE_SIZE = 5;

/**
 * Notification bell + dropdown. Lives in the member topbar.
 *
 * Behaviour:
 * - Polls the unread count every 60s; the count is also refreshed
 *   whenever a mark-read mutation completes (via query invalidation).
 * - Opens a Bootstrap `Dropdown` containing the most recent
 *   notifications (top 5) when clicked. The list is fetched on
 *   first open and then cached.
 * - Clicking a notification in the dropdown marks it as read.
 * - "Tandai semua dibaca" in the dropdown header marks every
 *   notification as read.
 * - "Lihat semua notifikasi" at the dropdown footer deep-links to
 *   the full `/m/notifications` page.
 *
 * The bell is rendered only on authenticated member pages (the
 * topbar receives the `profile` from `MemberAuthContext`).
 */
function MemberNotificationBell({}: Props) {
  const [open, setOpen] = React.useState(false);
  const unreadQuery = useMemberUnreadNotificationCount();

  const dropdownPagination: IPaginationOptions = React.useMemo(
    () => ({
      pageIndex: 0,
      pageSize: DROPDOWN_PAGE_SIZE,
      searchTerm: '',
    }),
    []
  );

  // Fetch the dropdown list lazily — only when the dropdown is
  // opened for the first time. After that, React Query caches the
  // result and the same `enabled: open` flag keeps it in sync.
  const listQuery = useMemberNotificationsList(dropdownPagination);
  React.useEffect(() => {
    if (open) {
      listQuery.refetch();
    }
    // We intentionally do not depend on listQuery.refetch — refetch
    // identity changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const markRead = useMarkMemberNotificationRead();
  const markAllRead = useMarkAllMemberNotificationsRead();

  const onItemClick = (notification: {
    notificationId: string;
    read: boolean;
  }) => {
    if (!notification.read) {
      markRead.mutate(notification.notificationId);
    }
  };

  const unreadCount = unreadQuery.data ?? 0;
  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <Dropdown
      show={open}
      onToggle={(next) => setOpen(next)}
      align="end"
      className="my-auto"
    >
      <Dropdown.Toggle
        as="button"
        id="member-notification-bell"
        type="button"
        className="btn btn-link nav-link text-white position-relative px-2"
        aria-label={
          unreadCount > 0
            ? `Notifikasi, ${unreadCount} belum dibaca`
            : 'Notifikasi'
        }
      >
        <FontAwesomeIcon icon={faBell} size="lg" />
        {unreadCount > 0 ? (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
            data-testid="member-notification-unread-badge"
          >
            {displayCount}
          </Badge>
        ) : null}
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{ minWidth: 320, maxWidth: 360 }}
        className="p-0 shadow"
        align="end"
      >
        <Dropdown.Header className="d-flex align-items-center justify-content-between">
          <span className="fw-semibold">Notifikasi</span>
          <button
            type="button"
            className="btn btn-link btn-sm p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (unreadCount > 0) {
                markAllRead.mutate();
              }
            }}
            disabled={unreadCount === 0 || markAllRead.isPending}
            aria-label="Tandai semua notifikasi sudah dibaca"
          >
            {markAllRead.isPending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Tandai semua dibaca'
            )}
          </button>
        </Dropdown.Header>
        <div
          style={{ maxHeight: 360, overflowY: 'auto' }}
          data-testid="member-notification-dropdown-list"
        >
          {listQuery.isLoading ? (
            <MemberNotificationLoadingRow layout="dropdown" />
          ) : listQuery.isError ? (
            <MemberNotificationErrorRow
              layout="dropdown"
              message={
                (listQuery.error as any)?.message || 'Gagal memuat notifikasi.'
              }
            />
          ) : (listQuery.data?.rows?.length ?? 0) === 0 ? (
            <MemberNotificationEmptyRow layout="dropdown" />
          ) : (
            listQuery.data?.rows?.map((n) => (
              <MemberNotificationItem
                key={n.notificationId}
                notification={n}
                layout="dropdown"
                onItemClick={onItemClick}
              />
            ))
          )}
        </div>
        <Dropdown.Divider />
        <div className="text-center py-2">
          <Link
            href="/m/notifications"
            className="small text-decoration-none"
            onClick={() => setOpen(false)}
          >
            Lihat semua notifikasi
          </Link>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MemberNotificationBell;
