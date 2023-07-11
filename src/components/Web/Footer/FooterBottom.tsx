import Link from 'next/link';
import React from 'react';

type Props = {};

function FooterBottom({}: Props) {
  return (
    <div
      className="container-fluid bg-dark text-white py-4 px-sm-3 px-md-5"
      style={{ fontSize: 18 }}
    >
      <p className="m-0 text-center text-white">
        &copy;{' '}
        <Link className="text-white font-weight-medium" href="/">
          Tante Laundry 71
        </Link>
        . All Rights Reserved.
        {/* Credit Link */} All Rights Reserved{' '}
        <a
          className="text-white fw-bold"
          href="https://github.com/MuhammadAkbar11"
        >
          MuhammadAkbar11
        </a>
      </p>
    </div>
  );
}

export default FooterBottom;
