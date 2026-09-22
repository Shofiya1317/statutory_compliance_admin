'use client';

import { ReactNode } from 'react';
import { Badge as BootstrapBadge } from 'react-bootstrap';

type Iprops = {
  className?: string;
  bg: string;
  children: ReactNode;
};

export default function Badge({ className, bg, children }: Iprops) {
  return (
    <BootstrapBadge className={className} bg={bg}>
      {children}
    </BootstrapBadge>
  );
}
