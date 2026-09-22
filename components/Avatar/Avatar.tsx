'use client';

import ReactAvatar from 'react-avatar';
import { PropsWithChildren } from 'react';

type Iprops = PropsWithChildren<{
  name: string;
  size: string;
  className?: string;
  avator: string;
}>;

function Avatar({
  name, size, className, avator,
}: Iprops) {
  return (
    <ReactAvatar
      name={name?.charAt(0)?.toLocaleUpperCase()}
      size={size}
      className={className}
      src={avator || ''}
    />
  );
}

export default Avatar;
