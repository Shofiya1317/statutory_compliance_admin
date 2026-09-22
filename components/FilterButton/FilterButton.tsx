'use client';

import { ReactElement } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { GrPowerReset } from 'react-icons/gr';
import styles from './FilterButton.module.css';

export default function FilterButton({
  children,
  show,
  setShow,
  cancel,
}: {
  children: ReactElement;
  show: boolean;
  setShow: (data: boolean) => void;
  cancel: () => void;
}) {
  return (
    <div className="position-relative">
      <Button
        variant="outline-secondary"
        className="fw-normal  bg-white d-flex align-items-center border px-sm-4 py-2 "
        onClick={() => setShow(!show)}
        style={{ color: '#212529' }}
      >
        Filter By
      </Button>
      {show && (
        <div className={`${styles.dropdown} my-2 filter-z-index`}>
          <div className=" d-flex justify-content-between align-items-center border-bottom py-2">
            <h6 className="fw-semibold m-0"> Filters </h6>
            <h6 className="fw-bold m-0">
              <GrPowerReset onClick={() => cancel()} />
            </h6>
          </div>
          <Stack className="my-2">{children}</Stack>
        </div>
      )}
    </div>
  );
}
