import Logo from '@components/Logo/Logo';
import { APP_NAME } from '@configs/varsConfig';
import Link from 'next/link';
import React from 'react';

type Props = {};

function SidebarBrand({}: Props) {
  return (
    <Link className="sidebar-brand d-flex justify-content-center pb-0" href="/">
      {/* <span className="align-middle">{APP_NAME}</span> */}
      <Logo height={52} width={52 * 3} />
    </Link>
  );
}

export default SidebarBrand;
