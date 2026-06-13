/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Nav, Navbar as BsNavbar } from 'react-bootstrap';
import { useAdminLayoutContext } from '@utils/context/AdminLayoutContext';

import DropdownUserProfile from '../Dropdowns/DropdownUserProfile/DropdownUserProfile';
import AdminNotificationBell from '@features/admin/notifications/AdminNotificationBell';
import AppIcon from '@components/Icons/AppIcon';

function AdminNavbar() {
  const { onToggleSidebar } = useAdminLayoutContext();
  return (
    <BsNavbar expand className=" navbar-light navbar-bg">
      <a
        href="#/"
        onClick={(e) => {
          e.preventDefault();
          onToggleSidebar();
        }}
        className="sidebar-toggle js-sidebar-toggle"
      >
        <i className="hamburger align-self-center" />
      </a>
      <BsNavbar.Collapse>
        <Nav className="navbar-align">
          <AdminNotificationBell />
          <div className="d-flex align-items-center justify-content-center">
            <AppIcon
              name="Minus"
              style={{ transform: 'rotate(90deg)' }}
              size={25}
            />
          </div>
          <DropdownUserProfile />
        </Nav>
      </BsNavbar.Collapse>
    </BsNavbar>
  );
}

export default AdminNavbar;
