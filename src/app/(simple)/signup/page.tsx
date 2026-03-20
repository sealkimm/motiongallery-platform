'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useSocialLogin from '@/hooks/useSocialLogin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignupForm from '@/features/auth/components/SignupForm';
import SocialLoginButtons from '@/features/auth/components/SocialLoginButtons';

const SignupPage = () => {
  const router = useRouter();
  const { onClickSocialLogin } = useSocialLogin();

  const handleSignupSuccess = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pb-12 pt-24">
      <div className="container w-full max-w-md">
        <Card className="border-white/10 bg-gray-900/50 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="gradient-text mb-2 text-3xl font-bold">
              회원가입
            </CardTitle>
            <CardDescription className="text-gray-400">
              좋아하는 모션을 기록하고 공유하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <SignupForm onSuccess={handleSignupSuccess} />
              <div className="border-t border-white/10"></div>
              <SocialLoginButtons onClickSocialLogin={onClickSocialLogin} />
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              이미 계정이 있으신가요?
              <Link
                href="/login"
                className="ml-2 align-text-bottom text-purple-400 transition-colors hover:text-purple-300"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
