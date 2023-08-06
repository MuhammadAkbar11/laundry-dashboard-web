/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import React from 'react';

type Props = {
  children: React.ReactNode;
};

function WebMiscLayout({ children }: Props) {
  return (
    <main className="d-flex bg-white w-100 " style={{ minHeight: '100vh' }}>
      {children}
    </main>
  );
}

export default WebMiscLayout;
