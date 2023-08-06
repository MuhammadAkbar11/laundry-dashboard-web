/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import Footer from '@/components/Footer/AdminFooter';
import Navbar from '@/components/Navbar/AdminNavbar';
import Sidebar from '@components/Sidebar/AdminSidebar';
import ModalConfirmationSignOut from '@components/Modals/ModalConfirmationSignOut';
import { IPageProps } from '@interfaces';
import { useUserAuthContext } from '@utils/context/UserAuthContext';

type Props = {
  children: React.ReactNode;
} & IPageProps;

function AdminLayout(props: Props) {
  const { children, userAuth } = props;
  const userAuthCtx = useUserAuthContext();

  React.useEffect(() => {
    if (userAuth) userAuthCtx.onSetUser(userAuth);
  }, [userAuth, userAuthCtx]);

  React.useEffect(() => {
    const __nextEL = document.getElementById('__next') as HTMLDivElement;
    __nextEL.classList.add('wrapper');

    return () => {
      __nextEL.classList.remove('wrapper');
    };
  }, []);

  return (
    <>
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content">{children}</main>
        <Footer />
      </div>
      <ModalConfirmationSignOut />
    </>
  );
}

export default AdminLayout;
