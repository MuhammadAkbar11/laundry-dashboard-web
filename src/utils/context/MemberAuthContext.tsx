import { IMemberAuth } from '@interfaces';
import React, { createContext, ReactNode } from 'react';

type MemberAuthContextType = {
  member: IMemberAuth | null;
  isLoading: boolean;
  onSetMember: (member: IMemberAuth) => void;
};

const pageDetailContextDefaultValues: MemberAuthContextType = {
  member: null,
  isLoading: true,
  onSetMember: () => {},
};

export const MemberAuthContext = createContext<MemberAuthContextType>(
  pageDetailContextDefaultValues
);

export function useMemberAuthContext() {
  const context = React.useContext(MemberAuthContext);
  if (context === undefined) {
    throw new Error('useMemberAuthContext must wrapper in the provider');
  }

  return { ...context };
}

type Props = {
  children: ReactNode;
};

export function MemberAuthCtxProvider({ children }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [memberState, setMemberState] = React.useState<IMemberAuth | null>(
    null
  );

  const onSetMember = (member: IMemberAuth) => {
    setLoading(false);
    setMemberState(member);
  };

  const value: MemberAuthContextType = React.useMemo(
    () => ({
      member: memberState,
      isLoading: loading,
      onSetMember,
    }),
    [loading, memberState]
  );

  return (
    <MemberAuthContext.Provider value={value}>
      {children}
    </MemberAuthContext.Provider>
  );
}
