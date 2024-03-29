import Link from 'next/link';
import clsx from 'classnames';
import React from 'react';
import { Container, Navbar as BsNavbar, Nav } from 'react-bootstrap';
import useMemberAuth from '@hooks/useMemberAuth';
import { IMemberAuth } from '@interfaces';
import MemberDropdownProfile from '@components/Web/Dropdowns/MemberDropdownProfile';
import LoadingPulse from '@components/Utils/LoadingPulse';
// import LogoSmall from '@components/Logo/LogoSmall';
import Logo from '@components/Logo/Logo';

function Navbar() {
  const memberAuth = useMemberAuth();

  const isAuth = memberAuth?.isAuth;
  const authState = memberAuth?.authState;
  const authLoading = memberAuth?.isLoading;

  return (
    <Container fluid className={clsx('position-relative webnav-bar  p-0')}>
      <div
        className="container-lg w-100 position-relative px-0 px-lg-3 font-opensans "
        style={{ zIndex: 9 }}
      >
        <BsNavbar
          expand="lg"
          bg="white"
          variant="light"
          className=" py-1 ps-lg-5 "
          style={{ boxSizing: 'border-box' }}
        >
          <Link passHref legacyBehavior href="/">
            <BsNavbar.Brand className="d-flex gap-3 ">
              <Logo height={46} width={45 * 3} />
            </BsNavbar.Brand>
          </Link>
          <BsNavbar.Toggle aria-controls="navbarCollapse" className="me-3" />
          <BsNavbar.Collapse
            id="navbarCollapse"
            className="justify-content-between px-3"
          >
            <Nav className="navbar-nav ms-auto py-0 fw-bold text-uppercase gap-3 ">
              <Link passHref legacyBehavior href="/tentang">
                <Nav.Link className="nav-item">Tentang</Nav.Link>
              </Link>
              <Link passHref legacyBehavior href="/layanan">
                <Nav.Link className="nav-item">Layanan</Nav.Link>
              </Link>
              <Link passHref legacyBehavior href="/kontak">
                <Nav.Link className="nav-item">Kontak</Nav.Link>
              </Link>
            </Nav>
            <Nav className="py-0 fw-bold text-uppercase border-start ps-2 ms-2 ">
              {authLoading ? (
                <LoadingPulse />
              ) : (
                <MemberDropdownProfile
                  isLogin={isAuth}
                  profile={authState as IMemberAuth}
                />
              )}
            </Nav>
          </BsNavbar.Collapse>
        </BsNavbar>
      </div>
    </Container>
  );
}

export default Navbar;
