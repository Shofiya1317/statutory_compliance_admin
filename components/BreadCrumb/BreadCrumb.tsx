import Link from 'next/link';
import React from 'react';
import { BreadCrumbProps, IBreadCrumbProps } from '../types';
import './BreadCrumb.css';

export function BreadCrumb({ breadCrumb }: IBreadCrumbProps) {
  return (
    <div>
      {breadCrumb?.map((item: BreadCrumbProps) => (
        <React.Fragment key={item?.title}>
          {item?.isTitle && (
            <h4 className="fw-semibold Bread_crumb_title cursor-pointer mb-1">
              {item.title}
            </h4>
          )}
          {item?.isSubTitle && (
            <h6 className="fw-semibold Bread_crumb_title mb-0 cursor-pointer">
              {item.title}
            </h6>
          )}
          {item?.breadCrumb?.length
            && item?.breadCrumb?.map((data: BreadCrumbProps) => (data.url ? (
              <Link
                key={data?.title}
                href={data.url}
                className="text-decoration-none link_title"
              >
                {data.title}
                <span className="ps-1 pe-1">/</span>
              </Link>
            ) : (
              <div className="link_title" key={item?.title}>
                {data.title}
                <span className="ps-1 pe-1">/</span>
              </div>
            )))}
        </React.Fragment>
      ))}
    </div>
  );
}
