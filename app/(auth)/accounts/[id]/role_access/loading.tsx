import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function generateDummyArray(length: number) {
  return Array.from({ length }, () => crypto.randomUUID());
}

export default function RoleAccessTableLoading() {
  const dummyRoles = generateDummyArray(5); // mimic roleAccess.role
  const dummyModules = generateDummyArray(10); // mimic roleAccess.module

  return (
    <div className="table-responsive">
      <table className="table">
        <thead style={{ background: '#305B61', color: '#fefefe' }}>
          <tr className="table_white_head">
            <th className="text-center">
              <Skeleton width={20} />
            </th>
            {dummyRoles.map((roleId) => (
              <th className="text-center py-4" key={roleId}>
                <Skeleton width={100} height={20} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dummyModules.map((moduleId) => (
            <tr className="tableHover" key={moduleId}>
              <th className="text-center">
                <Skeleton width={120} />
              </th>
              {dummyRoles.map((roleId) => (
                <td className="text-center" key={`${moduleId}-${roleId}`}>
                  <ul className="rolelist">
                    {Array.from({ length: 2 }).map((_, _featureIdx) => {
                      const featureId = crypto.randomUUID();
                      return (
                        <li key={featureId}>
                          <div className="roleCheckbox">
                            <Skeleton circle width={20} height={20} />
                          </div>
                          <p className="ff-questrial fw-light m-0">
                            <Skeleton width={100} />
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
