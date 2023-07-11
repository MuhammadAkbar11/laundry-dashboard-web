import Link from 'next/link';
import React from 'react';
import { Container, Navbar as BsNavbar, Nav } from 'react-bootstrap';

function Navbar() {
  return (
    <Container fluid className=" position-relative webnav-bar p-0">
      <div
        className="container-lg w-100 position-relative px-0 px-lg-3 font-opensans "
        style={{ zIndex: 9 }}
      >
        <BsNavbar
          expand="lg"
          bg="white"
          variant="light"
          className="py-4 py-lg-2 ps-3 ps-lg-5"
        >
          <Link passHref legacyBehavior href="/">
            <BsNavbar.Brand>
              <h1 className="m-0 text-accent2 fw-bolder ">
                <span className="text-accent1">TANTE LAU</span>NDRY 71
              </h1>
            </BsNavbar.Brand>
          </Link>
          <BsNavbar.Toggle aria-controls="navbarCollapse" />
          <BsNavbar.Collapse
            id="navbarCollapse"
            className="justify-content-between px-3"
          >
            <Nav className="navbar-nav ms-auto py-0 fw-bold text-uppercase ">
              <Link passHref legacyBehavior href="/tentang">
                <Nav.Link className="nav-item">Tentang</Nav.Link>
              </Link>
              <Link passHref legacyBehavior href="/layanan">
                <Nav.Link className="nav-item">Layanan</Nav.Link>
              </Link>
              <Nav.Link href="#" className="nav-item">
                Harga
              </Nav.Link>
            </Nav>
            <Nav className="py-0 fw-bold text-uppercase border-start ps-2 ms-2 ">
              <Link legacyBehavior passHref href="/login">
                <Nav.Link className="text-accent1">Login</Nav.Link>
              </Link>
            </Nav>
          </BsNavbar.Collapse>
        </BsNavbar>
      </div>
    </Container>
  );
}

export default Navbar;
