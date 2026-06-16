import React from 'react';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';

type Props = {};

function MemberSidebarProfile({}: Props) {
  const { member: profile } = useMemberAuthContext();

  return (
    <div className="member-sidebar-profile mb-3 pb-3 border-bottom">
      <h2 className="fw-bolder text-accent1 m-0 text-truncate">
        {profile?.username || '...'}
      </h2>
      <p className="mb-0 mt-n1 text-muted text-lowercase fst-italic text-truncate">
        {profile?.email || '...'}
      </p>
    </div>
  );
}

export default MemberSidebarProfile;
