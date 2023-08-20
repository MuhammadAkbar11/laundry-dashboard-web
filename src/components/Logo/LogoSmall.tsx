import React from 'react';
import Image from 'next/image';

type Props = {
  height?: number;
  width?: number;
};

function LogoSmall({ height, width }: Props) {
  return (
    <div style={{ height, width }} className="position-relative">
      <Image fill src="/img/icons/logo-sm.png" alt="logo-sm" priority />
    </div>
  );
}

LogoSmall.defaultProps = {
  height: 50,
  width: 50,
};

export default LogoSmall;
