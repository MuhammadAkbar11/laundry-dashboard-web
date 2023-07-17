import { APP_NAME } from '@configs/varsConfig';
import Link from 'next/link';
import React from 'react';

type Props = {};

function SidebarBrand({}: Props) {
  return (
    <Link className="sidebar-brand" href="/">
      <span className="align-middle">{APP_NAME}</span>
    </Link>
  );
}

export default SidebarBrand;
