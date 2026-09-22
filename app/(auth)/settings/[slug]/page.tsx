import AddorEditUser from '@/components/AddorEditUser/AddorEditUser';
import ChangePassword from '@/components/ChangePasswordForm/ChangePasswordForm';
import SettingNav from '@/components/SettingNav/SettingNav';
import { auth } from '@/lib/auth';
import { IUser } from '@/lib/interface/IUser.interface';
import { UserService } from '@/lib/service';

export default async function page({ params }: { params: { slug: string } }) {
  const session = await auth();
  const token = (session?.user as { accessToken: string })?.accessToken;
  const currentUser = await UserService.getCurrentUser(token);

  const { user } = currentUser?.data as {
    user: IUser;
  };

  function RenderComponents() {
    switch (params?.slug) {
      case 'personal_profile':
        return <AddorEditUser actionType="Save" currentUser={user} />;
      case 'change_password':
        return <ChangePassword />;
      default:
        return <>Access Denied</>;
    }
  }

  return (
    <SettingNav activePage={params?.slug} data={user}>
      {RenderComponents()}
    </SettingNav>
  );
}
