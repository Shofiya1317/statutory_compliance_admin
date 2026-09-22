'use client';

import { IAccount } from '@/lib/interface/IAccount.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Session } from 'next-auth';
import { Accordion, Stack } from 'react-bootstrap';
import Avatar from '../Avatar/Avatar';
import Badge from '../Badge/Badge';
import ActionDropDown from './ActionDropDown';

function Member({ account }: { account: IAccount }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div>
            <Avatar
              name={account.name}
              size="40px"
              className="rounded-circle me-2 "
              avator={(account.avatar ?? '') as string}
            />
          </div>
          <div className=" ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {account.name}
            </h5>
          </div>
        </div>

        <div className="mt-2 ms-5 ps-3">
          <Badge
            bg={getStatusColor(account.status, true)}
            className={getStatusColor(account.status, false)}
          >
            {account?.status?.replace('_', ' ')}
          </Badge>
        </div>
      </div>
    </Stack>
  );
}

export default function ListAccountMobile({
  accounts,
  data,
}: {
  accounts: IAccount[];
  data: Session | null;
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {accounts.map((account) => (
        <Accordion.Item
          eventKey={account.id}
          key={account.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Member account={account} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Invited On
                    </span>
                    <h6 className="">{formatDateList(account.createdAt)}</h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Joined On
                    </span>
                    <h6 className="">{formatDateList(account.confirmed_at)}</h6>
                  </div>
                </div>
              </div>

              <div className="col-2">
                <ActionDropDown account={account} data={data} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
