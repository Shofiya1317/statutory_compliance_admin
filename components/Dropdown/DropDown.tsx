'use client';

import { PropsWithChildren } from 'react';
import { DropdownButton } from 'react-bootstrap';
import { BiDotsVerticalRounded } from 'react-icons/bi';

type Iprops = PropsWithChildren<{
  isAction?: boolean;
}>;

function Dropdown({ children, isAction = false }: Iprops) {
  return (
    <DropdownButton
      id={isAction ? '' : 'dropdown-basic-button'}
      className={isAction ? 'savebtn p-0 ' : 'bg-transparent common-dropdown '}
      title={isAction ? 'Action' : <BiDotsVerticalRounded color="#212529" />}
    >
      {children}
    </DropdownButton>
  );
}

export default Dropdown;
