'use client';

import { IRoleAccess, IRolesAndAccess } from '@/lib/interface/IRole.interface';
import { AccountService } from '@/lib/service';
import { convertToPascalCase } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '../Button/Button';
import './rolesAndAccess.css';

export default function RolesAndAccess({
  roleAccess,
  isMaster,
}: {
  roleAccess: IRolesAndAccess | undefined;
  isMaster?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [roleAccessDetails, setRoleAccessDetails] = useState<IRoleAccess>();
  const urlParams = useParams();

  const getRoleAccessDetails = useCallback(async () => {
    const res = await AccountService.getAccountAccess(urlParams?.id as string);
    const { success, role_access: access } = res?.data as {
      role_access: IRoleAccess;
      success: boolean;
    };
    if (success) {
      setIsLoading(false);
      setRoleAccessDetails(access);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMAsterRoleAccessDetails = useCallback(async () => {
    const res = await AccountService.getMasterRoles(urlParams?.id as string);
    const { success, role_access: access } = res?.data as {
      role_access: IRoleAccess;
      success: boolean;
    };
    if (success) {
      setIsLoading(false);
      setRoleAccessDetails(access);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMaster) {
      getMAsterRoleAccessDetails();
    } else {
      getRoleAccessDetails();
    }
  }, [getMAsterRoleAccessDetails, getRoleAccessDetails, isMaster]);

  const getValue = async (
    isChecked: boolean,
    role: string,
    module: string,
    features: string[] | null | undefined,
    value: string,
  ) => {
    setIsLoading(true);
    const safeFeatures = Array.isArray(features) ? features : [];
    const updatedFeatures = isChecked
      ? Array.from(new Set([...safeFeatures, value]))
      : safeFeatures.filter((feature) => feature !== value);
    const params = { role, module, features: updatedFeatures };
    let res;
    if (isMaster) {
      res = await AccountService.updateMasterRoles(params);
    } else {
      res = await AccountService.updateAccountAccess(
        urlParams?.id as string,
        params,
      );
    }
    const { success } = res?.data as {
      success: boolean;
    };
    if (success) {
      setRoleAccessDetails((prev) => {
        const updated = { ...(prev ?? {}) };
        if (!updated[role]) {
          updated[role] = {};
        }
        updated[role][module] = updatedFeatures;
        return updated;
      });
      setIsLoading(false);
    }
  };

  const resetRoles = async () => {
    setIsLoading(true);
    const res = await AccountService.resetAccountRole(urlParams?.id as string);
    const { success, error } = res?.data as {
      success: boolean;
      error: string[];
    };
    if (success) {
      toast.success('Reset Account Roles');
      getRoleAccessDetails();
    } else {
      toast.error(error.join(', '));
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isMaster && (
        <div className="d-flex justify-content-end mb-3">
          <Button type="button" onClick={resetRoles} className="savebtn">
            Reset Role
          </Button>
        </div>
      )}
      <table className="table ">
        <thead style={{ background: '#305B61', color: '#fefefe' }}>
          <tr className="table_white_head ">
            <th className="text-center ">
              <span className="type">#</span>
            </th>
            {roleAccess?.role?.map((item: string) => (
              <th className="text-center py-4" key={item}>
                <span className="type">
                  {convertToPascalCase(item?.replace('_', ' '))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roleAccess?.module?.map((module: string) => (
            <tr className="tableHover" key={module}>
              <th className="text-center ">
                {convertToPascalCase(module?.replaceAll('_', ' '))}
              </th>
              {roleAccess?.role?.map((role: string) => (
                // eslint-disable-next-line react/jsx-key
                <td className="text-center">
                  {roleAccess?.feature?.[module]?.map((feature: string) => (
                    <ul className="rolelist " key={feature}>
                      <li>
                        <div className=" roleCheckbox">
                          {isLoading ? (
                            <Skeleton circle width={20} height={10} />
                          ) : (
                            <input
                              id={feature}
                              type="checkbox"
                              onChange={(e) => {
                                getValue(
                                  e.target.checked,
                                  role,
                                  module,
                                  roleAccessDetails?.[role]?.[module] as
                                    | string[]
                                    | [],
                                  feature,
                                );
                              }}
                              checked={
                                roleAccessDetails
                                && roleAccessDetails?.[role]
                                && roleAccessDetails?.[role]?.[module]
                                && roleAccessDetails?.[role]?.[module]?.includes(
                                  feature,
                                )
                              }
                            />
                          )}
                        </div>
                        <p className=" ff-questrial fw-light m-0">
                          {convertToPascalCase(
                            feature?.replaceAll('/', ' ')?.replaceAll('_', ' '),
                          )}
                        </p>
                      </li>
                    </ul>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
