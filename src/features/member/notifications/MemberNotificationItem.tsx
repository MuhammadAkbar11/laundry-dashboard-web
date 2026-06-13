/* eslint-disable react/require-default-props */
import React from 'react';
import Link from 'next/link';
import { Badge, Dropdown, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faCircleDot,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { formatDistance } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import type { IMemberNotification } from '@interfaces';

type Props = {
  notification: IMemberNotification;
  onItemClick?: (notification: IMemberNotification) => void;
  showStatus?: boolean;
  layout?: 'dropdown' | 'page';
};

/**
 * Single notification row used both in the bell dropdown and the
 * full /m/notifications page. Two layouts:
 *
 * - `dropdown`: compact, no card chrome, fits inside a Bootstrap
 *   `Dropdown.Menu` (used for "recent" view).
 * - `page` (default): full-width card-style row with a "Tandai
 *   sudah dibaca" affordance and the unread dot.
 *
 * The component intentionally does not perform navigation: the
 * data field is rendered for future use but no router.push is
 * issued (issue 017-B §7 "Notification Metadata Support" — actual
 * navigation implementation is not required).
 */
function MemberNotificationItem({
  notification,
  onItemClick,
  showStatus = true,
  layout = 'page',
}: Props) {
  const timeAgo = React.useMemo(() => {
    try {
      return formatDistance(new Date(notification.createdAt), new Date(), {
        addSuffix: true,
        locale: localeId,
      });
    } catch {
      return '';
    }
  }, [notification.createdAt]);

  const content = (
    <div className="d-flex align-items-start gap-2">
      <FontAwesomeIcon
        icon={notification.read ? faCircle : faCircleDot}
        className={notification.read ? 'text-muted' : 'text-accent1'}
        // Tiny dot only — the icon already communicates "unread" by
        // being filled. The aria-label on the wrapper below covers
        // screen readers.
        aria-hidden
        size="xs"
      />
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2">
          <strong className="d-block">{notification.title}</strong>
          {!notification.read && showStatus ? (
            <Badge bg="accent1" pill className="text-white">
              Baru
            </Badge>
          ) : null}
        </div>
        <div className="text-muted small">{notification.message}</div>
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
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      tabIndex={0}
      onClick={() => onItemClick?.(notification)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick?.(notification);
        }
      }}
      aria-label={`Notifikasi: ${notification.title}`}
    >
      <Link
        href="/m/notifications"
        // Prevent navigation away from the bell — the page is the
        // canonical place to view details. The item itself is the
        // "mark as read" trigger.
        onClick={(e) => e.stopPropagation()}
        className="stretched-link d-none"
        aria-hidden
        tabIndex={-1}
      />
      {content}
    </li>
  );
}

function MemberNotificationLoadingRow({
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

function MemberNotificationEmptyRow({
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
        Notifikasi pesanan dan pembayaran akan muncul di sini.
      </div>
    </li>
  );
}

function MemberNotificationErrorRow({
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
  MemberNotificationItem,
  MemberNotificationLoadingRow,
  MemberNotificationEmptyRow,
  MemberNotificationErrorRow,
};
export type { Props as MemberNotificationItemProps };
