import React from 'react';
import { APP_NAME, APP_VERSION } from '@configs/varsConfig';

type Props = {};

function MemberFooter({}: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="font-opensans border-top bg-white py-3 mt-auto">
      <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-1">
        <p className="m-0 text-muted small">
          &copy; {year} {APP_NAME}. Hak cipta dilindungi.
        </p>
        <p className="m-0 text-muted small">Versi {APP_VERSION}</p>
      </div>
    </footer>
  );
}

export default MemberFooter;
