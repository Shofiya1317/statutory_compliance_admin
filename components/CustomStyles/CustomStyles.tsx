/* eslint-disable @typescript-eslint/no-explicit-any */

import { CSSObjectWithLabel } from 'react-select';
import { CustomStylesProps } from '../types';

export const CustomStyles = {
  option: (
    styles: CSSObjectWithLabel,
    { isFocused, isSelected }: CustomStylesProps,
  ): CSSObjectWithLabel => {
    let backgroundColor;
    let color;

    if (isSelected) {
      backgroundColor = 'var(--btn-primary)';
      color = 'var(--bgColor)';
    } else if (isFocused) {
      backgroundColor = 'var(--btn-primary)';
      color = 'var(--bgColor)';
    }

    return {
      ...styles,
      backgroundColor,
      color,
    };
  },
  control: (provided: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...provided,
    backgroundColor: 'var(--bgColor)',
    minHeight: '33px',
    // maxWidth: '345px'
  }),
  menuList: (styles: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...styles,
    backgroundColor: 'var(--bgColor)',
  }),
  clearIndicator: (styles: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...styles,
    display: 'flex',
    padding: '0 8px',
    cursor: 'pointer',
    color: 'var(--textColor, #666)',
    ':hover': {
      color: 'var(--btn-primary)',
    },
  }),
  indicatorSeparator: (styles: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...styles,
    backgroundColor: 'var(--borderColor, #ccc)',
  }),
};
