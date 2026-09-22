'use client';

import Badge from '@/components/Badge/Badge';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import { IFileRepo } from '@/lib/interface/IFileRepo.interface';
import FileRepoDropdown from './FileRepoDropdown';

function FileRepoItem({ fileRepo }: { fileRepo: IFileRepo }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {fileRepo?.company_name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(
                  fileRepo.is_deleted ? 'DELETED' : 'ACTIVE',
                  true,
                )}
                className={getStatusColor(
                  fileRepo.is_deleted ? 'DELETED' : 'ACTIVE',
                  false,
                )}
              >
                {fileRepo.is_deleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function FileRepoList({ fileRepos }: { fileRepos: IFileRepo[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {fileRepos?.map((fileRepo) => (
        <Accordion.Item
          eventKey={fileRepo.id}
          key={fileRepo.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <FileRepoItem fileRepo={fileRepo} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(fileRepo.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <FileRepoDropdown fileRepo={fileRepo} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
