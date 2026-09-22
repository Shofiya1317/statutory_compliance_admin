import AuthLayout from '@/components/AuthLayout/AuthLayout';
import SigninForm from '@/components/SigninForm/SigninForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

  if (session?.user) {
    return redirect('/');
  }

  return (
    <AuthLayout title="Dear Admin," subTitle="Sign in to your account">
      <div className="pt-4">
        <SigninForm />
      </div>
    </AuthLayout>
  );
};

export default page;
