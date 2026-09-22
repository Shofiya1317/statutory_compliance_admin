'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Session } from 'next-auth';
import { Accordion, Stack } from 'react-bootstrap';
import Avatar from '../Avatar/Avatar';
import Badge from '../Badge/Badge';
import ActionDropDown from './ActionDropDown';

function Member({ user }: { user: IUser }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div>
            <Avatar
              name={user?.first_name}
              size="40"
              className="rounded-circle"
              avator={
                // user?.avatar !== null || user?.avatar !== undefined
                //   ? user?.avatar
                //   :
                ''
              }
            />
          </div>
          <div className=" ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {user?.first_name?.toLowerCase()}
            </h5>
            <small className=" my-2 text-dark">{user.email}</small>
          </div>
        </div>

        <div className="mt-2 ms-5 ps-3">
          <Badge
            bg={getStatusColor(user.status, true)}
            className={getStatusColor(user.status, false)}
          >
            {user?.status?.replace('_', ' ')}
          </Badge>
        </div>
      </div>
    </Stack>
  );
}

export default function ListUsersMobile({
  users,
  data,
}: {
  users: IUser[];
  data: Session | null;
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {users?.map((user: IUser) => (
        <Accordion.Item
          eventKey={user.id}
          key={user.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Member user={user} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Role
                    </span>
                    <h6 className=" text-capitalize">
                      {user?.role?.name?.toLowerCase().split('_').join(' ')}
                    </h6>
                  </div>
                  <div className="me-5">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Contact Number
                    </span>
                    <h6 className="mt-1">{user.phone_number}</h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Joined On
                    </span>
                    <h6 className="">{formatDateList(user.createdAt)}</h6>
                  </div>
                </div>
              </div>

              <div className="col-2">
                <ActionDropDown user={user} data={data} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
