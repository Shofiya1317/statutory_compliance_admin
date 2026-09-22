'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Nav } from 'react-bootstrap';
import ChangeAvatar from '../ChangeAvatar/ChangeAvatar';

export default function SettingNav({
  activePage,
  children,
  data,
}: {
  activePage: string;
  children: ReactNode;
  data: IUser;
}) {
  const pathname = usePathname();
  return (
    <div className="container-fluid px-md-4 pt-4">
      <div className="overflow-scroll mb-4">
        <ul className="d-flex  pt-3 ps-0 " style={{ maxWidth: '900px' }}>
          <li className=" me-4 " style={{ minWidth: '120px' }}>
            <Nav.Link
              href="/settings/personal_profile"
              className="text-decoration-none  "
              active={activePage === 'personal_profile'}
            >
              <span
                className={`edit_link_routes ${
                  pathname?.includes('/settings/personal_profile') && 'active'
                }`}
              >
                Personal Profile
              </span>
            </Nav.Link>
          </li>
          <li className=" me-4" style={{ minWidth: '120px' }}>
            <Nav.Link
              href="/settings/change_password"
              className="text-decoration-none  "
              active={activePage === 'change_password'}
            >
              <span
                className={`edit_link_routes ${
                  pathname?.includes('/settings/change_password') && 'active'
                }`}
              >
                Change Password
              </span>
            </Nav.Link>
          </li>
          {/* <li className=" me-4" style={{ minWidth: '120px' }}>
            <Nav.Link
              href="/settings/roles_access"
              className="text-decoration-none  "
              active={activePage === 'roles_access'}
            >
              <span
                className={`edit_link_routes ${
                  pathname?.includes('/settings/roles_access') && 'active'
                }`}
              >
                Roles and Access
              </span>
            </Nav.Link>
          </li> */}
        </ul>
      </div>
      {pathname?.includes('/roles_access') ? (
        <div>{children}</div>
      ) : (
        <div className="row pb-5" style={{ height: '100%' }}>
          <div className=" col-lg-8 col-12 ">
            <div className=" p-3 boxshadowSm">{children}</div>
          </div>
          <div className=" col-md-4  col-12 d-none d-lg-block ">
            <div
              style={{
                background: '#fefefe',
                boxShadow: ' 0 0px 4px rgb(0 0 0 / 0.2)',
                height: '100%',
              }}
            >
              {data && <ChangeAvatar user={data} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
