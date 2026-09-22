'use client';

import { ReactNode } from 'react';
import { Dropdown } from 'react-bootstrap';
import { IoFilterSharp } from 'react-icons/io5';
import './Filter.css';

function Filter({ children }: { children: ReactNode }) {
  return (
    <Dropdown className="position-relative" data-testid="Filter Content">
      <Dropdown.Toggle
        variant=""
        style={{ color: '#212529', height: '37px' }}
        className="fw-normal  bg-white d-flex align-items-center border px-sm-4 py-2 "
      >
        <IoFilterSharp fontSize={24} color="var(--btn-primary)" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown_filter_css p-3">
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Filter;
