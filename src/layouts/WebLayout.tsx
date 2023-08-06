import React from 'react';
import Footer from '@components/Web/Footer/Footer';
import Navbar from '@components/Web/Navbar/Navbar';
import Topbar from '@components/Web/Topbar/Topbar';
import WebModalConfirmationSignOut from '@components/Web/Modals/WebModalConfirmationSignOut';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';
import { IMemberPageProps } from '@interfaces';

type Props = {
  children: React.ReactNode;
} & IMemberPageProps;

function WebLayout({ children, memberAuth }: Props) {
  const memberAuthCtx = useMemberAuthContext();
  React.useEffect(() => {
    if (memberAuth) memberAuthCtx.onSetMember(memberAuth);
  }, [memberAuth, memberAuthCtx]);

  return (
    <>
      <Topbar />
      <Navbar />
      {children}
      <Footer />
      <WebModalConfirmationSignOut />
    </>
  );
}

export default WebLayout;
