/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Nav, Navbar as BsNavbar } from 'react-bootstrap';
import { useAdminLayoutContext } from '@utils/context/AdminLayoutContext';

import DropdownUserProfile from '../Dropdowns/DropdownUserProfile/DropdownUserProfile';

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
          {/* <DropdownNotification /> */}
          {/* <DropdownMessages /> */}
          <DropdownUserProfile />
        </Nav>
      </BsNavbar.Collapse>
    </BsNavbar>
  );
}

export default AdminNavbar;
