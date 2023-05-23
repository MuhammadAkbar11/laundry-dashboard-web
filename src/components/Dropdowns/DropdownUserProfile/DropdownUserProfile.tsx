/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import * as Icon from 'react-feather';
import { Dropdown, NavItem } from 'react-bootstrap';
import { useUserAuthContext } from '@utils/context/UserAuthContext';
import { API_URI } from '@configs/varsConfig';
import { useAdminLayoutContext } from '@utils/context/AdminLayoutContext';
import DropdownToggle from '../DropdownToggle';

type Props = {};

function DropdownUserProfile({}: Props) {
  const userAuthCtx = useUserAuthContext();
  const adminLayoutCtx = useAdminLayoutContext();

  const onLogoutConfirm = () => {
    adminLayoutCtx.onToggleModalSignOut();
  };

  return (
    <Dropdown as={NavItem}>
      <Dropdown.Toggle
        as={DropdownToggle}
        id="Profiledropdown"
        className="nav-icon d-inline-block d-sm-none"
      >
        <Icon.Settings size={18} />
      </Dropdown.Toggle>
      <Dropdown.Toggle
        as={DropdownToggle}
        id="Profiledropdown"
        className="nav-link d-none d-sm-inline-block"
      >
        <img
          src={
            `${API_URI}${userAuthCtx.user?.avatar}` || '/img/avatars/avatar.jpg'
          }
          className="avatar img-fluid rounded me-1"
          alt={userAuthCtx.user?.name || 'user profile avatar'}
        />{' '}
        <span className="text-dark me-1 text-capitalize ">
          {userAuthCtx.user?.name || '...'}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="dropdown-menu-end"
        aria-labelledby="Profiledropdown"
      >
        <Link href="/profile" legacyBehavior passHref>
          <Dropdown.Item>
            <Icon.User className="align-middle me-1" size={18} /> Profile
          </Dropdown.Item>
        </Link>
        <Dropdown.Item href="/#">
          <Icon.PieChart className="align-middle me-1" size={18} /> Analytics
        </Dropdown.Item>
        <div className="dropdown-divider" />
        <Dropdown.Item href="index.html">
          <Icon.Settings className="align-middle me-1" size={18} /> Settings
          &amp; Privacy
        </Dropdown.Item>
        <Dropdown.Item href="/#">
          <Icon.HelpCircle className="align-middle me-1" size={18} /> Help
          Center
        </Dropdown.Item>
        <div className="dropdown-divider" />
        <Dropdown.Item
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            onLogoutConfirm();
          }}
        >
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownUserProfile;
