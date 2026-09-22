'use client';

import MobileFilter from '@/components/MobileFilter/MobileFilter';
import { ReactNode, useState } from 'react';

type ParentMobileFilterProps = {
  children: (props: { onCancel: () => void }) => ReactNode;
};

export default function ParentMobileFilter({
  children,
}: ParentMobileFilterProps) {
  const [show, setShow] = useState<boolean>(false);

  const onCancel = () => {
    setShow(false);
  };

  return (
    <MobileFilter show={show} setShow={setShow}>
      {children({ onCancel })}
    </MobileFilter>
  );
}
