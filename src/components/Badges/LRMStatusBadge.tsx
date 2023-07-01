import React from 'react';
import clsx from 'classnames';
import { Badge } from 'react-bootstrap';

type LRMStatusBadgeProps = {
  value: string;
};

function LRMStatusBadge({ value }: LRMStatusBadgeProps): JSX.Element {
  const clsNm = clsx('p-2 rounded-0 d-flex align-items-center', {
    'bg-primary': value === 'WASHED',
    'bg-success': value === 'FINISHED',
    'bg-info ': value === 'READY',
  });

  let content: JSX.Element;

  if (value === 'READY') {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Ready</span>
      </Badge>
    );
  } else if (value === 'FINISHED') {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Selesai</span>
      </Badge>
    );
  } else {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Dicuci</span>
      </Badge>
    );
  }

  return <div className="d-inline-block">{content}</div>;
}

export default LRMStatusBadge;
