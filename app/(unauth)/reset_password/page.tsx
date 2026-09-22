import AuthLayout from '@/components/AuthLayout/AuthLayout';
import ResetPassword from '@/components/ResetPasswordForm/ResetPassword';

export default async function Page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return (
    <AuthLayout title="Dear Admin," subTitle="Reset your password">
      <div className="pt-4">
        <ResetPassword token={searchParams?.token} />
      </div>
    </AuthLayout>
  );
}
