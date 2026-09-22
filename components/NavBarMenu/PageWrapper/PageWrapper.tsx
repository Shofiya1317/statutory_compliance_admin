/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { ReactElement } from 'react';
import { Nav } from 'react-bootstrap';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

export interface BreadCrumbsItem {
  title: string;
  url: any;
  tag?: boolean;
}
type PageWrapperProps = React.PropsWithChildren<{
  stackComponent?: ReactElement;
  breadCrumbsItem?: BreadCrumbsItem[];
}>;

export default function PageWrapper({
  children,
  stackComponent,
  breadCrumbsItem,
}: PageWrapperProps) {
  return (
    <div className=" ">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex  align-items-center flex-wrap">
          {breadCrumbsItem?.map((item: BreadCrumbsItem) => (
            <React.Fragment key={item?.title}>
              <h5
                style={{
                  borderBottom: '2px solid #212529',
                  fontSize: '14px',
                }}
                className="m-0"
              >
                <Nav.Link
                  href={item?.url}
                  className="sub_item"
                  style={{
                    fontSize: '14px',
                  }}
                >
                  {item?.title?.includes('<img')
                    ? 'Image'
                    : item?.title?.includes('<table')
                      ? 'Table'
                      : item?.title}
                </Nav.Link>
              </h5>
              {item?.tag && (
                <span className="px-2 mt-1">
                  <MdOutlineArrowForwardIos fontSize={14} />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="d-flex flex-row-reverse">{stackComponent}</div>
      </div>
      <div className="d-flex flex-column">{children}</div>
    </div>
  );
}
