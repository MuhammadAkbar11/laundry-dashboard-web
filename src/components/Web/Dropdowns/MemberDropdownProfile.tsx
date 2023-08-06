import React from 'react';
import Link from 'next/link';
import { Dropdown, Nav } from 'react-bootstrap';
import { IMemberAuth } from '@interfaces';
// import { useQueryClient } from '@tanstack/react-query';
import { memberProfileNavigationConfigs } from '@configs/navigationConfigs';
import Image from 'next/image';
import { API_URI } from '@configs/varsConfig';
import { useWebLayoutContext } from '@utils/context/WebLayoutContext';

type Props = {
  isLogin: boolean;
  profile: IMemberAuth;
};

function MemberDropdownProfile(props: Props) {
  const { isLogin, profile } = props;
  const profileMenu = memberProfileNavigationConfigs;

  const webLayoutCtx = useWebLayoutContext();
  // const queryClient = useQueryClient();

  const onLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    webLayoutCtx.onToggleModalSignOut();
  };

  const avatar = profile?.avatar
    ? `${API_URI}${profile?.avatar}`
    : '/img/avatars/avatar-1.png';

  return (
    <>
      {!isLogin ? (
        <Link legacyBehavior passHref href="/login">
          <Nav.Link className="text-accent1">Login</Nav.Link>
        </Link>
      ) : null}
      {isLogin ? (
        <Dropdown
          as="li"
          className="my-auto d-flex nav-item dropdown-member-profile "
        >
          <div>
            <Dropdown.Toggle
              as="a"
              href="#"
              role="button"
              className="ms-2"
              id="dropdown-profile-toggle"
            >
              <Image
                src={avatar}
                className="rounded-circle"
                width={32}
                height={32}
                alt="avatar"
                style={{
                  objectFit: 'cover',
                }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" align="end" className="border-0 shadow ">
              {profileMenu.map((mn, idx) => {
                const key = idx;
                return (
                  <li key={key}>
                    <Link href={mn.href} passHref legacyBehavior>
                      <Dropdown.Item
                        className="text-lg "
                        style={{ textDecoration: 'none' }}
                      >
                        {mn.text}
                      </Dropdown.Item>
                    </Link>
                  </li>
                );
              })}
              <Dropdown.Divider />
              <li>
                <Dropdown.Item
                  href="/log-out"
                  className="text-lg text-decoration-none"
                  onClick={onLogout}
                >
                  Log Out
                </Dropdown.Item>
              </li>
            </Dropdown.Menu>
          </div>
        </Dropdown>
      ) : null}
    </>
  );
}

export default MemberDropdownProfile;
