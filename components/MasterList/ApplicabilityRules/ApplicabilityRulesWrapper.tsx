import { ReactNode } from 'react';

function ApplicabilityRulesWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className="fw-semibold">Name</th>
              <th className="fw-semibold">Sector</th>
              <th className="fw-semibold">Industries</th>
              <th className="fw-semibold">State</th>
              <th className="fw-semibold">Listing Status</th>
              <th className="fw-semibold">Employee Count</th>
              <th className="fw-semibold">Revenue Band</th>
              <th className="fw-semibold">Updated-At</th>
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

export default ApplicabilityRulesWrapper;
