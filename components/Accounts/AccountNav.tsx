/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';
import { Nav } from 'react-bootstrap';

export default function AccountNav({
  account,
  activePage,
}: {
  account: any;
  activePage: string;
}) {
  return (
    <div>
      <div className="overflow-scroll mb-4">
        <ul className="d-flex  pt-3 ps-0 " style={{ maxWidth: '900px' }}>
          <li className=" me-4 ">
            <Nav.Link
              active={activePage === 'Dashboard'}
              className=" text-decoration-none"
              href={`/accounts/${account?.id}`}
            >
              <span
                className={`edit_link_routes ${
                  activePage === 'Dashboard' ? 'active' : ''
                }`}
              >
                Dashboard
              </span>
            </Nav.Link>
          </li>
          <li className=" me-4 ">
            <Nav.Link
              active={activePage === 'members'}
              className=" text-decoration-none"
              href={`/accounts/${account?.id}/members`}
            >
              <span
                className={`edit_link_routes ${
                  activePage === 'members' && 'active'
                }`}
              >
                Users
              </span>
            </Nav.Link>
          </li>
          <li className=" me-4 ">
            <Nav.Link
              active={activePage === 'projects'}
              className=" text-decoration-none"
              href={`/accounts/${account?.id}/projects`}
            >
              <span
                className={`edit_link_routes ${
                  activePage === 'projects' && 'active'
                }`}
              >
                Projects̋
              </span>
            </Nav.Link>
          </li>
          <li style={{ minWidth: '110px' }}>
            <Nav.Link
              active={activePage === 'info'}
              className=" text-decoration-none"
              href={`/accounts/${account?.id}/info`}
            >
              <span
                className={`edit_link_routes ${
                  activePage === 'info' && 'active'
                }`}
              >
                Account Info
              </span>
            </Nav.Link>
          </li>
          <li style={{ minWidth: '155px' }}>
            <Nav.Link
              active={activePage === 'reports'}
              className=" text-decoration-none"
              href={`/accounts/${account?.id}/reports`}
            >
              <span
                className={`edit_link_routes ${
                  activePage === 'reports' && 'active'
                }`}
              >
                Customize Dashboard
              </span>
            </Nav.Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
