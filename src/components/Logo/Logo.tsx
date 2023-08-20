import React from 'react';
import Image from 'next/image';

type Props = {
  height?: number | string;
  width?: number | string;
  variant?: 'light' | 'primary';
};

function Logo({ height, width, variant }: Props) {
  const imgURL =
    variant === 'light'
      ? '/img/icons/logo-lg-white.png'
      : '/img/icons/logo-lg.png';
  return (
    <div style={{ height, width }} className="position-relative">
      <Image fill src={imgURL} alt="logo" priority />
    </div>
  );
}

Logo.defaultProps = {
  height: 50,
  width: 137,
  variant: 'primary',
};

export default Logo;
