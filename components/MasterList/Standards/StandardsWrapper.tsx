import Image from 'next/image';
import { ReactNode } from 'react';
import avatar from '../../../assests/avatarprofile.png';

function StandardsWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table ">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className="text-center">
                <Image src={avatar} alt="logo" width={40} />
              </th>
              <th className=" fw-semibold ">Standards Name</th>
              <th>
                <div className=" fw-semibold">Themes</div>
              </th>
              <th className=" fw-semibold">Updated-At</th>
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

export default StandardsWrapper;
