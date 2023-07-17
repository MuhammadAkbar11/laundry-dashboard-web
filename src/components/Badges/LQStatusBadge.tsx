import React from 'react';
import clsx from 'classnames';
import { Badge } from 'react-bootstrap';
import FeatherIcon from '@components/Icons/FeatherIcon';

type LQStatusBadgeProps = {
  value: string;
  onClick?: (e: React.MouseEvent) => void;
  endIcon?: React.ReactNode;
  disabled?: boolean;
};

function LQStatusBadge({
  value,
  onClick,
  endIcon,
  disabled,
}: LQStatusBadgeProps): JSX.Element {
  const clsNm = clsx('p-2 rounded-0 border-0 d-flex align-items-center', {
    'bg-primary': value === 'WASHED',
    'bg-success': value === 'FINISHED',
    'bg-blue': value === 'ONHOLD',
    'bg-warning text-dark': value === 'PENDING',
    'bg-danger': value === 'CANCELED',
    'disabled opacity-75': disabled,
  });

  let content: JSX.Element;

  if (value === 'ONHOLD') {
    content = (
      <Badge
        as="button"
        disabled={disabled}
        className={clsNm}
        onClick={onClick}
      >
        <FeatherIcon name="Activity" size={12} />
        <span className="ms-1">Proses</span>
        {endIcon}
      </Badge>
    );
  } else if (value === 'FINISHED') {
    content = (
      <Badge
        as="button"
        disabled={disabled}
        className={clsNm}
        onClick={onClick}
      >
        <FeatherIcon name="CheckCircle" size={12} />
        <span className="ms-1">Selesai</span>
        {endIcon}
      </Badge>
    );
  } else if (value === 'PENDING') {
    content = (
      <Badge
        as="button"
        disabled={disabled}
        className={clsNm}
        onClick={onClick}
      >
        <FeatherIcon name="MinusCircle" size={12} />
        <span className="ms-1">Menunggu</span>
        {endIcon}
      </Badge>
    );
  } else if (value === 'CANCELED') {
    content = (
      <Badge
        as="button"
        disabled={disabled}
        className={clsNm}
        onClick={onClick}
      >
        <FeatherIcon name="XCircle" size={12} />
        <span className="ms-1">DiBatalkan</span>
        {endIcon}
      </Badge>
    );
  } else {
    content = (
      <Badge
        as="button"
        disabled={disabled}
        className={clsNm}
        onClick={onClick}
      >
        <FeatherIcon name="RefreshCcw" size={12} />
        <span className="ms-1">Cuci</span>
        {endIcon}
      </Badge>
    );
  }

  return <div className="d-inline-block">{content}</div>;
}

LQStatusBadge.defaultProps = {
  onClick: () => null,
  endIcon: null,
  disabled: true,
};

export default LQStatusBadge;
