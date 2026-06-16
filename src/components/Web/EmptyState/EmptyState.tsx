import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
  title: string;
  description?: string;
  icon?: IconProp;
};

function EmptyState({ title, description, icon = faInbox }: Props) {
  return (
    <div className="text-center text-muted py-4">
      <FontAwesomeIcon icon={icon} size="2x" className="mb-2 opacity-50" />
      <p className="fw-semibold mb-0 text-dark">{title}</p>
      {description ? <p className="small mb-0">{description}</p> : null}
    </div>
  );
}

EmptyState.defaultProps = {
  description: undefined,
  icon: faInbox,
};

export default EmptyState;
