'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import { Accordion, Stack } from 'react-bootstrap';
import Avatar from '../Avatar/Avatar';
import Badge from '../Badge/Badge';
import Dropdown from '../Dropdown/DropDown';

function Member({ user }: { user: IUser }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div>
            <Avatar
              name={user.first_name}
              size="40px"
              className="rounded-circle me-2 "
              avator={(user.avatar_url || '') as string}
            />
          </div>
          <div className=" ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {`${user.first_name} ${user.last_name}`}
            </h5>
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

export default function AccountList({ users }: { users: IUser[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {users.map((user) => (
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
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Joined On
                    </span>
                    <h6 className="">{formatDateList(user.createdAt)}</h6>
                  </div>
                </div>
              </div>

              <div className="col-2">
                <Dropdown>
                  <ul className="dropdown_section p-2">
                    <li>
                      <Link
                        className="text-decoration-none"
                        href={{ pathname: `/accounts/${user.id}/info` }}
                      >
                        <li className="dropdown-item">Info</li>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        href={{
                          pathname: `/accounts/${user.id}/members`,
                        }}
                      >
                        <li className="dropdown-item">Members</li>
                      </Link>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
