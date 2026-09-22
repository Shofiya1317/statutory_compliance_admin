import Avatar from '@/components/Avatar/Avatar';
import Badge from '@/components/Badge/Badge';
import AccountFilter from '@/components/Filter/AccountFilter/AccountFilter';
import Filter from '@/components/Filter/Filter';
import InviteButton from '@/components/InviteButton/InviteButton';
import ActionDropDown from '@/components/ListAccountMobile/ActionDropDown';
import ListAccountMobile from '@/components/ListAccountMobile/ListAccountMobile';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import PageWrapper from '@/components/NavBarMenu/PageWrapper/PageWrapper';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import Sort from '@/components/Sort/Sort';
import { auth } from '@/lib/auth';
import { IAccount, IAccountFilter } from '@/lib/interface/IAccount.interface';
import { IMeta } from '@/lib/interface/IMeta.interface';
import { AccountService } from '@/lib/service';
import { formatDateList, getStatusColor, Params } from '@/lib/utils';
import AccountWrapper from './AccountWrapper';
import MobileFilter from './MobileFilter';

export default async function page({
  searchParams,
}: {
  searchParams: IAccountFilter;
}) {
  const session = await auth();
  const accessToken = (
    session?.user as {
      accessToken: string;
    }
  )?.accessToken;
  const params = {
    sort: searchParams?.sort || '-createdAt',
    limit: searchParams?.limit || '25',
    page: searchParams?.page || '1',
    search: searchParams?.search || '',
    status: searchParams?.status || '',
  };

  const res = await AccountService?.getAllAcounts(params, accessToken);

  const { accounts, meta } = res?.data as {
    success: boolean;
    accounts: IAccount[];
    meta: IMeta;
  };

  const breadCrumbsItem = [
    {
      title: `Accounts (${meta?.totalCount || 0})`,
      url: '/accounts',
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
              <AccountFilter params={params} />
            </Filter>
          </div>
          <div className=" mt-2 ms-2">
            <InviteButton btnName="Account" />
          </div>
        </div>
      )}
    >
      <div className="common-mobile-searchsection mb-3">
        <Search params={params as Params} />
      </div>

      {accounts?.length > 0 ? (
        <>
          <AccountWrapper>
            {accounts?.map((account: IAccount) => (
              <tr key={account.id} className="tableHover">
                <td className=" text-center">
                  <Avatar
                    name={account.account_name}
                    size="40px"
                    className="rounded-circle me-2 "
                    avator={(account.avatar ?? '') as string}
                  />
                </td>
                <td>
                  <div>{account?.account_name}</div>
                </td>
                <td>
                  <div>{account?.slug}</div>
                </td>
                <td>{account.email}</td>
                <td>{formatDateList(account?.createdAt)}</td>
                <td>{formatDateList(account?.confirmed_at)}</td>
                <td>
                  <Badge
                    bg={getStatusColor(account.status, true)}
                    className={getStatusColor(account.status, false)}
                  >
                    {account?.status}
                  </Badge>
                </td>
                <td className="text-center">
                  <ActionDropDown account={account} data={session} />
                </td>
              </tr>
            ))}
          </AccountWrapper>
          <ListAccountMobile accounts={accounts} data={session} />
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
