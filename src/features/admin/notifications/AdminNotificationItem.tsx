/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable react/require-default-props */
import React from 'react';
import Link from 'next/link';
import { Badge, Dropdown, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faCircleDot,
  faBell,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { formatDistance } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import type { IUserNotification } from '@interfaces';

type Props = {
  notification: IUserNotification;
  onItemClick?: (notification: IUserNotification) => void;
  showStatus?: boolean;
  layout?: 'dropdown' | 'page';
};

function AdminNotificationItem({
  notification,
  onItemClick,
  showStatus = true,
  layout = 'page',
}: Props) {
  const timeAgo = React.useMemo(() => {
    try {
      return formatDistance(
        new Date(notification.notification.createdAt),
        new Date(),
        { addSuffix: true, locale: localeId }
      );
    } catch {
      return '';
    }
  }, [notification.notification.createdAt]);

  const content = (
    <div className="d-flex align-items-start gap-2">
      <FontAwesomeIcon
        icon={notification.isRead ? faCircle : faCircleDot}
        className={notification.isRead ? 'text-muted' : 'text-accent1'}
        aria-hidden
        size="xs"
      />
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <strong className="d-block">{notification.notification.title}</strong>
          {!notification.isRead && showStatus ? (
            <Badge bg="accent1" pill className="text-white">
              Baru
            </Badge>
          ) : null}
          {notification.isGlobal ? (
            <Badge
              bg="light"
              text="dark"
              className="border d-inline-flex align-items-center gap-1"
            >
              <FontAwesomeIcon icon={faGlobe} size="xs" />
              Global
            </Badge>
          ) : null}
        </div>
        <div className="text-muted small">
          {notification.notification.message}
        </div>
        <div className="text-muted small mt-1">{timeAgo}</div>
      </div>
    </div>
  );

  if (layout === 'dropdown') {
    return (
      <Dropdown.Item
        as="button"
        type="button"
        className="text-wrap"
        onClick={() => onItemClick?.(notification)}
      >
        {content}
      </Dropdown.Item>
    );
  }

  return (
    <li
      className="list-group-item bg-white"
      role="button"
      tabIndex={0}
      onClick={() => onItemClick?.(notification)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick?.(notification);
        }
      }}
      aria-label={`Notifikasi: ${notification.notification.title}`}
    >
      <Link
        href="/admin/notifikasi"
        onClick={(e) => e.stopPropagation()}
        className="stretched-link d-none"
        aria-hidden
        tabIndex={-1}
      />
      {content}
    </li>
  );
}

function AdminNotificationLoadingRow({
  layout,
}: {
  layout: 'dropdown' | 'page';
}) {
  if (layout === 'dropdown') {
    return (
      <div className="text-center py-3 text-muted small">
        <Spinner animation="border" size="sm" role="status" className="me-2">
          <span className="visually-hidden">Memuat...</span>
        </Spinner>
        Memuat notifikasi...
      </div>
    );
  }
  return (
    <li className="list-group-item bg-white text-center text-muted">
      <Spinner animation="border" size="sm" role="status" className="me-2">
        <span className="visually-hidden">Memuat...</span>
      </Spinner>
      Memuat notifikasi...
    </li>
  );
}

function AdminNotificationEmptyRow({
  layout,
}: {
  layout: 'dropdown' | 'page';
}) {
  if (layout === 'dropdown') {
    return (
      <div className="text-center py-3 text-muted small">
        <FontAwesomeIcon icon={faBell} className="me-2" />
        Tidak ada notifikasi baru.
      </div>
    );
  }
  return (
    <li className="list-group-item bg-white text-center text-muted">
      <FontAwesomeIcon
        icon={faBell}
        size="2x"
        className="d-block mx-auto mb-2"
      />
      <div className="fw-semibold">Tidak ada notifikasi</div>
      <div className="small">
        Notifikasi pesanan, pembayaran, dan aktivitas admin akan muncul di sini.
      </div>
    </li>
  );
}

function AdminNotificationErrorRow({
  layout,
  message,
}: {
  layout: 'dropdown' | 'page';
  message?: string;
}) {
  if (layout === 'dropdown') {
    return (
      <div className="text-center py-3 text-danger small">
        {message || 'Gagal memuat notifikasi.'}
      </div>
    );
  }
  return (
    <li className="list-group-item bg-white text-center text-danger">
      {message || 'Gagal memuat notifikasi. Silahkan coba lagi.'}
    </li>
  );
}

export {
  AdminNotificationItem,
  AdminNotificationLoadingRow,
  AdminNotificationEmptyRow,
  AdminNotificationErrorRow,
};
export type { Props as AdminNotificationItemProps };
