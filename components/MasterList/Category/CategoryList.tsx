'use client';

import Badge from '@/components/Badge/Badge';
import { getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import CategoryActionDowpDown from './CategoryActionDowpDown';

function CategoryItem({ category }: { category: any }) {
  return (
    <Stack>
      <div className="my-2">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3 w-100">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {category?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(category?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT', true)}
                className={getStatusColor(category?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT', false)}
              >
                {category?.status || 'ACTIVE'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function CategoryList({ categories }: { categories: any[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {categories?.map((category) => (
        <Accordion.Item
          eventKey={category.id}
          key={category.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className="rounded-0"
            style={{ background: '#fefefe' }}
          >
            <CategoryItem category={category} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Description
                    </span>
                    <h6 className="mb-0">{category?.description || '-'}</h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Status
                    </span>
                    <h6 className="mb-0">{category?.status || 'ACTIVE'}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <CategoryActionDowpDown category={category} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
