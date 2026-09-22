'use client';

import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { GrPowerReset } from 'react-icons/gr';
import MobileSort from '../MobileSort/MobileSort';

export interface CommonsortandfilterProps {
  children: React.ReactNode;
  show: boolean;
  setShow: (data: boolean) => void;
  cancel?: () => void;
}

export default function MobileFilter(props: CommonsortandfilterProps) {
  const handleClose = () => props?.setShow(false);
  const handleShow = () => props?.setShow(true);
  const [isShown, setIsShown] = useState(false);
  const handleClick = () => {
    setIsShown((current) => !current);
  };
  return (
    <>
      <Modal fullscreen show={props?.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <div className="d-flex justify-content-between align-items-center border-bottom py-2">
            <h6 className="fw-semibold m-0"> Filters </h6>
            <h6 className="fw-bold m-0">
              <GrPowerReset onClick={() => props?.cancel && props?.cancel()} />
            </h6>
          </div>
        </Modal.Header>
        <Modal.Body>{props?.children}</Modal.Body>
      </Modal>
      {isShown && <MobileSort setIsShown={setIsShown} isShown={isShown} />}
      <div className="sort_filter_Mobile row m-0">
        <div className="col p-0 d-flex justify-content-evenly align-items-center border-end border-2">
          <div className="text-center">
            <h6 aria-hidden className="m-0 by fw-normal" onClick={handleClick}>
              Recently Updated
            </h6>
          </div>
        </div>
        <div className="col p-0 d-flex justify-content-evenly align-items-center">
          <div className="d-flex">
            <h6
              aria-hidden
              className="mb-0 by fw-normal mx-3"
              onClick={handleShow}
            >
              Filter By
            </h6>
          </div>
        </div>
      </div>
    </>
  );
}
