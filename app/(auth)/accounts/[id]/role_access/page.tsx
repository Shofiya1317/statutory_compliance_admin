import PageWrapper from '@/components/NavBarMenu/PageWrapper/PageWrapper';
import RolesAndAccess from '@/components/RolesAndAccess/RolesAndAccess';
import { auth } from '@/lib/auth';
import { AccountService } from '@/lib/service';

export default async function page({ params }: { params: { id: string } }) {
  const session = await auth();
  const accessToken = (
    session?.user as {
      accessToken: string;
    }
  )?.accessToken;

  const res = await AccountService.accontRoleConfig(accessToken);

  const breadCrumbsItem = [
    {
      title: 'Accounts',
      url: '/accounts',
      tag: true,
    },
    {
      title: 'Accounts',
      url: '/accounts',
      tag: true,
    },
    {
      title: 'Roles and Access',
      url: `/accounts/${params?.id}/role_access`,
    },
  ];

  return (
    <PageWrapper breadCrumbsItem={breadCrumbsItem}>
      <RolesAndAccess roleAccess={res?.data} />
    </PageWrapper>
  );
}
