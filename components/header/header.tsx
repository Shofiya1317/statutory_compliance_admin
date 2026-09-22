/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useUser } from '@/context/userProvider';
import { convertToPascalCase } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { isMobile as isMobileDevice } from 'react-device-detect';
import toast from 'react-hot-toast';
import { BsArrowRight } from 'react-icons/bs';
import logo from '../../assests/rubicr-product-logo.svg';
import Avatar from '../Avatar/Avatar';
import styles from './header.module.css';

export interface IMenuItem {
  label: string;
  path: string;
  isActive: boolean;
  featureName?: string;
  menuItems: { label: string; path: string; isActive: boolean }[];
}

export interface IProfileItem {
  label: string;
  path: string;
  isActive: boolean;
  menuItems: { label: string; path: string; isActive: boolean }[];
}

export interface HeaderProps {
  menuItems: IMenuItem[];
  profileMenu: IProfileItem[];
}

const getCurrentUrlActive = (item: IMenuItem, pathname: string): string => {
  switch (item.label) {
    case 'Dashboard':
      return pathname === '/' ? 'active' : '';
    case 'Users':
      return pathname === '/users' || pathname === '/users/invite'
        ? 'active'
        : '';
    case 'Accounts':
      return pathname?.includes('/accounts') ? 'active' : '';
    case 'Masters':
      return pathname?.includes('/masters') ? 'active' : '';
    default:
      return '';
  }
};

function NavbarItem({ item, pathname }: { item: IMenuItem; pathname: string }) {
  return isMobileDevice ? (
    <li>
      <Nav.Link href={item.path} className="d-flex justify-content-between">
        {item.label}
        <BsArrowRight fontSize={24} />
      </Nav.Link>
    </li>
  ) : (
    <Nav.Link className="me-3" href={item.path}>
      <span
        className={`menu_item_routes ${item.path.length} ${getCurrentUrlActive(item, pathname)}`}
      >
        {item.label}
      </span>
    </Nav.Link>
  );
}

function ProfileNavbarItem({
  item,
  router,
}: {
  item: IMenuItem;
  router: AppRouterInstance;
}) {
  return (
    <li
      aria-hidden
      className="sub_item"
      onClick={() => {
        router.push(item?.path);
        if (item.label === 'Logout') {
          signOut();
        }
      }}
    >
      {item.label}
    </li>
  );
}

function Profile({
  profileMenu,
  router,
}: {
  profileMenu: IProfileItem[];
  router: AppRouterInstance;
}) {
  return (
    <ul className="submenusection">
      {profileMenu.map((item: IMenuItem) => (
        <ProfileNavbarItem item={item} key={item.label} router={router} />
      ))}
    </ul>
  );
}

function Header(props: HeaderProps) {
  const [isProfileActive, setProfileActive] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const timeoutId = useRef<any>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const context = useUser();

  useEffect(() => {
    if (!context?.currentUser) {
      context?.getCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const INACTIVITYTIMEOUT = 30 * 60 * 1000;

  const notifySignout = () => toast.success('Signed Out', { duration: 3000 });

  const handleLogout = () => {
    notifySignout();
    signOut();
  };

  useEffect(() => {
    const handleLogoutOnTimeout = () => handleLogout();
    const handleUserActivity = () => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(handleLogoutOnTimeout, INACTIVITYTIMEOUT);
    };
    if (session) {
      timeoutId.current = setTimeout(handleLogoutOnTimeout, INACTIVITYTIMEOUT);
      document.addEventListener('click', handleUserActivity);
      document.addEventListener('mousemove', handleUserActivity);
      document.addEventListener('keydown', handleUserActivity);
    }
    return () => {
      clearTimeout(timeoutId.current);
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div
      className={
        isMobileDevice ? 'sticky-top' : 'sticky-top container-fluid p-0'
      }
    >
      <Navbar expand="lg" className="header_bg p-0">
        <Navbar.Brand href="/">
          <div className="d-flex justify-content-between">
            <div
              className="d-flex align-items-center fw-semibold ps-3 py-4"
              style={{ color: '#fefefe' }}
            >
              <h6 className="text-capitalize fw-semibold">
                <Image src={logo} alt="logo" width={130} priority />
              </h6>
            </div>
          </div>
        </Navbar.Brand>
        <div className="d-lg-none d-md-block hamburger">
          <input type="checkbox" id="active" />
          <label
            aria-hidden
            htmlFor="active"
            className="menu-btn"
            onClick={() => setIsActive(true)}
          >
            <span />
          </label>
          {isActive && (
            <label
              aria-hidden
              htmlFor="active"
              className="close"
              onClick={() => setIsActive(false)}
            />
          )}
          {isActive && (
            <div className="wrapper">
              <div
                className="d-flex justify-content-center"
                style={{ background: '#305B61' }}
              >
                <div className="d-flex py-4">
                  <h5
                    aria-hidden
                    className={`mx-3 fw-semibold menu_item_routes cursor-pointer ${isProfileActive ? 'active' : ''}`}
                    onClick={() => setProfileActive(true)}
                  >
                    Home
                  </h5>
                  <h5
                    aria-hidden
                    className={`mx-3 fw-semibold menu_item_routes cursor-pointer ${!isProfileActive ? 'active' : ''}`}
                    onClick={() => setProfileActive(false)}
                  >
                    Profile
                  </h5>
                </div>
              </div>
              {isProfileActive ? (
                <ul>
                  {props?.menuItems?.map((item: IMenuItem) => (
                    <NavbarItem
                      item={item}
                      key={item.label}
                      pathname={pathname}
                    />
                  ))}
                </ul>
              ) : (
                <Profile profileMenu={props?.profileMenu} router={router} />
              )}
            </div>
          )}
        </div>
        <Navbar.Collapse role="button" id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 ms-auto nav_height">
            {props?.menuItems.map((item: IMenuItem) => (
              <NavbarItem item={item} key={item.label} pathname={pathname} />
            ))}
          </Nav>
          {!isMobileDevice && (
            <div className={styles.dropdown_menu}>
              <ul className="dropdown_header_menu pe-1">
                <li>
                  <div style={{ width: '42px', height: '40px' }}>
                    <Avatar
                      name={convertToPascalCase(
                        `${context?.currentUser?.first_name} ${context?.currentUser?.last_name}`,
                      )}
                      size="40"
                      className="rounded-circle"
                      avator={context?.currentUser?.avatar_url || ''}
                    />
                  </div>
                  <Profile profileMenu={props?.profileMenu} router={router} />
                </li>
              </ul>
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
