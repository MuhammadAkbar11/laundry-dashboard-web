import React from 'react';
import clsx from 'classnames';
import { Badge } from 'react-bootstrap';

type UserRoleBadgeProps = {
  value: string;
};

function UserRoleBadge({ value }: UserRoleBadgeProps): JSX.Element {
  const clsNm = clsx('p-2 rounded-0 d-flex align-items-center', {
    'bg-primary': value === 'ADMIN',
    'bg-success': value === 'OPERATOR',
    'bg-info ': value === 'OFFICER',
  });

  let content: JSX.Element;

  if (value === 'ADMIN') {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Admin</span>
      </Badge>
    );
  } else if (value === 'OPERATOR') {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Operator</span>
      </Badge>
    );
  } else if (value === 'OFFICER') {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Petugas</span>
      </Badge>
    );
  } else {
    content = (
      <Badge
        className={`p-2 rounded-0 d-flex align-items-center bg-secondary `}
      >
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1 text-capitalize ">{value.toLowerCase()}</span>
      </Badge>
    );
  }

  return <div className="d-inline-block">{content}</div>;
}

export default UserRoleBadge;
