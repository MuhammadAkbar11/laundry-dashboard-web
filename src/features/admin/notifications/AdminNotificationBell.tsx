/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { Badge, Dropdown, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {
  useMarkAllUserNotificationsRead,
  useMarkUserNotificationRead,
  useUserNotificationsList,
  useUserUnreadNotificationCount,
} from '@hooks/useUserNotifications';
import type { IPaginationOptions } from '@interfaces';
import {
  AdminNotificationEmptyRow,
  AdminNotificationErrorRow,
  AdminNotificationItem,
  AdminNotificationLoadingRow,
} from './AdminNotificationItem';

type Props = {};

const DROPDOWN_PAGE_SIZE = 5;

function AdminNotificationBell({}: Props) {
  const [open, setOpen] = React.useState(false);
  const unreadQuery = useUserUnreadNotificationCount();

  const dropdownPagination: IPaginationOptions = React.useMemo(
    () => ({
      pageIndex: 0,
      pageSize: DROPDOWN_PAGE_SIZE,
      searchTerm: '',
    }),
    []
  );

  const listQuery = useUserNotificationsList(dropdownPagination);
  React.useEffect(() => {
    if (open) {
      listQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const markRead = useMarkUserNotificationRead();
  const markAllRead = useMarkAllUserNotificationsRead();

  const onItemClick = (notification: { id: string; isRead: boolean }) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
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
        id="admin-notification-bell"
        type="button"
        className="btn btn-link nav-link text-dark position-relative px-2"
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
            data-testid="admin-notification-unread-badge"
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
          data-testid="admin-notification-dropdown-list"
        >
          {listQuery.isLoading ? (
            <AdminNotificationLoadingRow layout="dropdown" />
          ) : listQuery.isError ? (
            <AdminNotificationErrorRow
              layout="dropdown"
              message={
                (listQuery.error as any)?.message || 'Gagal memuat notifikasi.'
              }
            />
          ) : (listQuery.data?.rows?.length ?? 0) === 0 ? (
            <AdminNotificationEmptyRow layout="dropdown" />
          ) : (
            listQuery.data?.rows?.map((n) => (
              <AdminNotificationItem
                key={n.id}
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
            href="/admin/notifikasi"
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

export default AdminNotificationBell;
