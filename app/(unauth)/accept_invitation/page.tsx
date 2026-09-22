import AcceptInvitation from '@/components/AcceptInvitation/AcceptInvitation';
import AuthLayout from '@/components/AuthLayout/AuthLayout';
import { IUser } from '@/lib/interface/IUser.interface';
import { AuthService } from '@/lib/service';

export default async function page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const data = await AuthService.verifyInvitation(searchParams?.token || '');
  const { success, error, user } = data?.data as {
    success: boolean;
    error: string[];
    user: IUser;
  };
  return success ? (
    <AuthLayout
      title={`Welcome ${`${user?.first_name} ${user.last_name}` || ''},`}
      subTitle="Complete Invitation!"
      classname="w-100"
    >
      <div className="pt-4">
        <AcceptInvitation token={searchParams?.token} user={user} />
      </div>
    </AuthLayout>
  ) : (
    <AuthLayout classname="w-100 d-flex justify-conent-center">
      <div className="pt-4 justify-conent-center">{error}</div>
    </AuthLayout>
  );
}
