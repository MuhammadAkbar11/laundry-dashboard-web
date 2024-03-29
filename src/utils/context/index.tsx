// import { useRouter } from 'next/router';
import React from 'react';
import { AdminLayoutCtxProvider } from './AdminLayoutContext';
import { UserAuthCtxProvider } from './UserAuthContext';
import { WebLayoutCtxProvider } from './WebLayoutContext';
import { MemberAuthCtxProvider } from './MemberAuthContext';

type ComponseProps = {
  providers: React.ElementType[];
  children: React.ReactNode;
};

export function ComposeContext(props: ComponseProps) {
  const { providers = [], children } = props;
  return (
    <>
      {providers.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
      }, children)}
    </>
  );
}

function ComposeCtxProvider({ children }: { children: React.ReactNode }) {
  const providers = [
    AdminLayoutCtxProvider,
    WebLayoutCtxProvider,
    UserAuthCtxProvider,
    MemberAuthCtxProvider,
  ];

  return <ComposeContext providers={providers}>{children}</ComposeContext>;
}

export default ComposeCtxProvider;
