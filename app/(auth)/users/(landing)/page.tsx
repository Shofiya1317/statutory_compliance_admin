import Avatar from '@/components/Avatar/Avatar';
import Badge from '@/components/Badge/Badge';
import Filter from '@/components/Filter/Filter';
import UserFilter from '@/components/Filter/UserFilter/UserFilter';
import InviteButton from '@/components/InviteButton/InviteButton';
import ActionDropDown from '@/components/ListUsersMobile/ActionDropDown';
import ListUsersMobile from '@/components/ListUsersMobile/ListUserMobile';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import PageWrapper from '@/components/NavBarMenu/PageWrapper/PageWrapper';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import Sort from '@/components/Sort/Sort';
import { auth } from '@/lib/auth';
import { IMeta } from '@/lib/interface/IMeta.interface';
import { IUser, IUserFilter } from '@/lib/interface/IUser.interface';
import { UserService } from '@/lib/service';
import { formatDateList, getStatusColor, Params } from '@/lib/utils';
import MemberWrapper from './memberWrapper';
import MobileFilter from './MobileFilter';

export default async function Page({
  searchParams,
}: {
  searchParams: IUserFilter;
}) {
  const session = await auth();
  const accessToken = (
    session?.user as {
      accessToken: string;
    }
  )?.accessToken;

  const params = {
    page: searchParams?.page,
    limit: searchParams?.limit,
    sort: searchParams?.sort,
    search: searchParams?.search,
    role: searchParams?.role,
    status: searchParams?.status,
  };

  if (searchParams?.status !== 'All') {
    params.status = searchParams?.status || '';
  }
  if (searchParams?.role !== 'All') {
    params.role = searchParams?.role || '';
  }

  const res = await UserService?.getAllUsers(params, accessToken);

  const { users, meta } = res?.data as {
    success: boolean;
    users: IUser[];
    meta: IMeta;
  };

  const breadCrumbsItem = [
    {
      title: `Users (${meta?.totalCount || 0})`,
      url: '/users',
    },
  ];
  return (
    <PageWrapper
      breadCrumbsItem={breadCrumbsItem}
      stackComponent={(
        <div className="d-flex align-items-center">
          <div className="desktop-search w-100 me-3">
            <Search params={params as Params} />
          </div>
          <div className="desktop-search" style={{ minWidth: '200px' }}>
            <Sort params={params as Params} />
          </div>
          <div className=" common-sort ms-3">
            <Filter>
              <UserFilter params={params} />
            </Filter>
          </div>
          <div className=" mt-2 ms-2">
            <InviteButton btnName="User" />
          </div>
        </div>
      )}
    >
      <div className="common-mobile-searchsection mb-3">
        <Search params={params as Params} />
      </div>

      {users?.length > 0 ? (
        <>
          <MemberWrapper>
            {users?.map((user: IUser) => (
              <tr key={user.id} className="tableHover">
                <td className=" text-center">
                  <Avatar
                    name={user.first_name}
                    size="40px"
                    className="rounded-circle me-2 "
                    avator={
                      // user.avatar !== null || user?.avatar !== undefined
                      //   ? user?.avatar
                      //   :
                      ''
                    }
                  />
                </td>
                <td>
                  <div style={{ textTransform: 'capitalize' }}>
                    {user?.first_name}
                  </div>
                </td>
                <td>{user.email}</td>

                <td>{user.phone_number}</td>
                <td className="text-capitalize">
                  {user?.role?.name?.toLowerCase().split('_').join(' ')}
                </td>
                <td>{formatDateList(user.createdAt)}</td>
                <td>{formatDateList(user.confirmed_at) || '-'}</td>

                <td>
                  <Badge
                    bg={getStatusColor(user.status, true)}
                    className={getStatusColor(user.status, false)}
                  >
                    {user?.status}
                  </Badge>
                </td>
                <td className="text-center">
                  <ActionDropDown user={user} data={session} />
                </td>
              </tr>
            ))}
          </MemberWrapper>
          <ListUsersMobile users={users} data={session} />
        </>
      ) : (
        <PageNotFound />
      )}

      {meta && (
        <div className="my-4  pagination_padding">
          <Pagination
            meta={meta}
            currentPage={searchParams?.page || '1'}
            component="Member"
          />
        </div>
      )}

      <div className="d-lg-none d-md-block">
        <MobileFilter params={params} />
      </div>
    </PageWrapper>
  );
}
