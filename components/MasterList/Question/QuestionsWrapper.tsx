import { ReactNode } from 'react';

function QuestionsWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="table-responsive d-none d-lg-block">
        <table className="table ">
          <thead style={{ background: '#305B61', color: '#fefefe' }}>
            <tr>
              <th className=" fw-semibold ">Question Title</th>
              <th className=" fw-semibold">Question Type</th>
              <th className=" fw-semibold">Indicator</th>
              <th className=" fw-semibold">Universal Question ID</th>
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

export default QuestionsWrapper;
