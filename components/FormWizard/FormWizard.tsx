'use client';

import React from 'react';
import { Stack } from 'react-bootstrap';

export interface FormWizardItem {
  title: string;
  selected?: boolean;
}

export interface FormWizardProps {
  items: FormWizardItem[];
  children: JSX.Element;
}

export default function FormWizard({ children, items }: FormWizardProps) {
  return (
    <>
      <Stack direction="horizontal" className="form-wizard my-3">
        {items.map((item: FormWizardItem, index: number) => (
          <Stack
            direction="vertical"
            key={item.title.toLowerCase().split(' ').join('-')}
            className=" justify-content-center align-items-center"
          >
            <Stack
              direction="horizontal"
              className={`form-wizard-item justify-content-center align-items-center ${
                !!item.selected && 'active'
              }`}
            >
              {index > 0 ? <hr /> : <div className="w-100" />}
              <Stack
                className="p-2 px-3  rounded-circle"
                style={{
                  border: '1px solid #3485AE',
                  color: item.selected ? 'white' : 'var(--btn-primary)',
                  background: item.selected
                    ? 'var(--btn-primary'
                    : 'transparent',
                }}
              >
                {index + 1}
              </Stack>
              {index < items.length - 1 ? (
                <hr />
              ) : (
                <div className="w-100"> </div>
              )}
            </Stack>
            <div
              className={` py-2 wizardTitle ${
                !!item.selected && 'fw-semibold'
              }`}
              style={{ width: '135px' }}
            >
              {item.title}
            </div>
          </Stack>
        ))}
      </Stack>
      <Stack className=" rounded p-2 my-3">{children}</Stack>
    </>
  );
}
