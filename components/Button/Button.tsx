'use client';

import { ReactNode } from 'react';
import BootstrapButton from 'react-bootstrap/Button';

export interface ButtonProps {
  children?: ReactNode;
  size?: 'lg' | 'sm' | undefined;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  size = 'lg',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
}: ButtonProps) {
  const getClassName = () => {
    if (className) {
      return `common-button ${className}`;
    }
    return 'common-button px-sm-4';
  };

  return (
    <BootstrapButton
      type={type}
      size={size}
      className={getClassName()}
      disabled={disabled}
      style={{ fontSize: '14px', color: '#fefefe', fontWeight: '600' }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </BootstrapButton>
  );
}
