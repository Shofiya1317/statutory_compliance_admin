'use client';

import { Accordion as BootStrapAccordion } from 'react-bootstrap';
import { AccordionProps } from '../types';
import './Accordion.css';

export function Accordion({
  accordionText,
  children,
  className,
  icon,
  rightHeader,
}: AccordionProps) {
  return (
    <div className={`${className ?? ''}`}>
      <BootStrapAccordion>
        <BootStrapAccordion.Item
          key=""
          eventKey=""
          className=""
          id={accordionText}
        >
          <div className=" ">
            <BootStrapAccordion.Header id={accordionText}>
              <div className=" d-flex align-items-center" id={accordionText}>
                {icon && (
                  <div className="accodion_icon d-flex align-items-center justify-content-center">
                    {icon ?? ''}
                  </div>
                )}
                <div className="accodion_text ">
                  {accordionText}
                  {' '}
                </div>
                {rightHeader && <div>{rightHeader}</div>}
              </div>
            </BootStrapAccordion.Header>
            <BootStrapAccordion.Body data-testid="Test Content">
              <div>{children}</div>
            </BootStrapAccordion.Body>
          </div>
        </BootStrapAccordion.Item>
      </BootStrapAccordion>
    </div>
  );
}
