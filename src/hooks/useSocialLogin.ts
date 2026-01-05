'use client';

import { toast } from 'sonner';

import { supabase } from '@/lib/supabase/client';

type Provider = 'google' | 'github' | 'kakao';

// try문 필요할까
const useSocialLogin = () => {
  const onClickSocialLogin = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
          redirectTo: `${window.location.origin}/callback`,
        },
      });
      if (error) {
        console.error('Social Login Error', error);
        toast.error(error.message);
        return;
      }
    } catch (error) {
      console.error('Social Login Error', error);
    }
  };

  return { onClickSocialLogin };
};

export default useSocialLogin;
