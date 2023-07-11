import React from 'react';
import Footer from '@components/Web/Footer/Footer';
import Navbar from '@components/Web/Navbar/Navbar';
import Topbar from '@components/Web/Topbar/Topbar';

type Props = {
  children: React.ReactNode;
};

function WebLayout({ children }: Props) {
  return (
    <>
      <Topbar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default WebLayout;
