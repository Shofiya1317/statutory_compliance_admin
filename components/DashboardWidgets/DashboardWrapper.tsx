/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { ReactNode } from 'react';

function DashboardWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table ">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className=" fw-semibold ">Department</th>
              {/* <th className=" fw-semibold">Tab Name</th>
              <th className=" fw-semibold">No.of Blocks</th> */}
              <th className=" fw-semibold">No.of Tabs</th>
              <th className=" fw-semibold">Updated At</th>
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

export default DashboardWrapper;
