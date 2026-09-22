import AuthLayout from '@/components/AuthLayout/AuthLayout';
import ForgetPasswordForm from '@/components/ForgetPasswordForm/ForgetPasswordForm';

export default async function ForgetPasswordPage() {
  return (
    <AuthLayout title="Oops," subTitle="Forgot password? Worry not!">
      <div className="pt-4">
        <ForgetPasswordForm />
      </div>
    </AuthLayout>
  );
}
