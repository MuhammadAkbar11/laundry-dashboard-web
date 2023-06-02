import React from 'react';
import clsx from 'classnames';
import { Badge } from 'react-bootstrap';
import FeatherIcon from '@components/Icons/FeatherIcon';

type LQStatusBadgeProps = {
  value: string;
};

function LQStatusBadge({ value }: LQStatusBadgeProps): JSX.Element {
  const clsNm = clsx('p-2 rounded-0 d-flex align-items-center', {
    'bg-primary': value === 'WASHED',
    'bg-success': value === 'FINISHED',
    'bg-warning text-dark': value === 'ONHOLD',
  });

  let content: JSX.Element;

  if (value === 'ONHOLD') {
    content = (
      <Badge className={clsNm}>
        <FeatherIcon name="Upload" size={12} />
        <span className="ms-1">Proses</span>
      </Badge>
    );
  } else if (value === 'FINISHED') {
    content = (
      <Badge className={clsNm}>
        <FeatherIcon name="CheckCircle" size={12} />
        <span className="ms-1">Selesai</span>
      </Badge>
    );
  } else {
    content = (
      <Badge className={clsNm}>
        <FeatherIcon name="RefreshCcw" size={12} />
        <span className="ms-1">Cuci</span>
      </Badge>
    );
  }

  return <div className="d-inline-block">{content}</div>;
}

export default LQStatusBadge;
