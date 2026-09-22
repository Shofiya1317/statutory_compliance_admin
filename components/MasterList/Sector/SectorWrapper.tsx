import { ReactNode } from 'react';

function SectorWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table ">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className=" fw-semibold ">Sector Name</th>
              <th>
                <div className=" fw-semibold">Industry Types</div>
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

export default SectorWrapper;
