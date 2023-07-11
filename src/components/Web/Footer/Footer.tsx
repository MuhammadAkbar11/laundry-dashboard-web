import React from 'react';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';

type Props = {};

function Footer({}: Props) {
  return (
    <div className="font-opensans">
      <FooterTop />
      <FooterBottom />
    </div>
  );
}

export default Footer;
