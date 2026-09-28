import { ReactNode } from 'react';

function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table ">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className="fw-semibold">Name</th>
              <th className="fw-semibold">Description</th>
              <th className="fw-semibold">Act</th>
              <th className="fw-semibold">Sequence</th>
              <th className="fw-semibold">Status</th>
              <th className="text-center fw-semibold">Action</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default SectionWrapper;
