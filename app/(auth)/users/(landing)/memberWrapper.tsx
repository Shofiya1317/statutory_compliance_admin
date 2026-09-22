import Image from 'next/image';
import { ReactNode } from 'react';
import avatar from '../../../avatarprofile.png';

function MemberWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table ">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className="text-center">
                <Image src={avatar} alt="logo" width={40} />
              </th>
              <th>
                <div className=" fw-semibold">Name</div>
              </th>
              <th className=" fw-semibold">Email Address</th>
              <th className=" fw-semibold">Contact Number</th>
              <th className=" fw-semibold">Role</th>
              <th className=" fw-semibold ">Invited on</th>
              <th className=" fw-semibold ">Joined on</th>
              <th className=" fw-semibold">Status</th>
              <th className="text-center fw-semibold">Action</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberWrapper;
