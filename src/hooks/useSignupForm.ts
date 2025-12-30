/**
 * @description 회원가입 폼을 처리하는 커스텀 훅
 *
 * @param {UseSignupFormProps} onSuccess - 회원가입 성공 후 콜백 함수
 *
 * @returns {object} form - 폼 상태와 함수
 * @returns {boolean} isLoading - 로딩 상태
 * @returns {boolean} isVerified - 이메일 인증 여부(useEmailVerification)
 * @returns {boolean} isEmailSent - 이메일 전송 여부(useEmailVerification)
 * @returns {boolean} isCodeSent - 인증코드 전송 여부(useEmailVerification)
 * @returns {function} sendVerificationCode - 인증코드 전송 함수(useEmailVerification)
 * @returns {function} verifyEmailCode - 이메일 인증 함수(useEmailVerification)
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase/client';
import useEmailVerification from '@/hooks/useEmailVerification';
import useSupabaseRequest from '@/hooks/useSupabaseRequest';
import { checkUserExists } from '@/features/auth/api/checkUserExists';
import { createRandomNickname } from '@/features/auth/api/createRandomNickname';
import { formSchema, type FormValues } from '@/features/auth/formSchema';

// signupform이랑 타입 중복 정의
interface UseSignupFormProps {
  onSuccess: () => void;
}

// 분리 필요하니
const DEFAULT_FORM_VALUES = {
  nickname: '',
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
};

const useSignupForm = ({ onSuccess }: UseSignupFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const {
    isVerified,
    isEmailSent,
    isCodeSent,
    sendVerificationCode,
    verifyEmailCode,
  } = useEmailVerification(form);

  const { execute: executeSignUp, isLoading } = useSupabaseRequest<
    { email: string; password: string; nickname: string },
    { user: User | null }
  >({
    requestFn: async ({
      email,
      password,
      nickname,
    }: {
      email: string;
      password: string;
      nickname: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
        },
      });
      return { data: { user: data?.user ?? null }, error };
    },
    onSuccess: async ({ user }) => {
      if (user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: form.getValues('password'),
        });

        if (signInError) {
          console.error('로긌 실패', signInError);
          toast.error('❌ 로그인에 실패했습니다.');
          return;
        }
      }
      toast.success('✅ 회원가입이 완료되었습니다.');
      onSuccess();
    },
    onError: error => {
      console.error('회원가입 실패', error);
      toast.error('❌ 회원가입에 실패했습니다.');
    },
  });

  const currentPassword = form.watch('password');

  useEffect(() => {
    if (currentPassword) {
      form.trigger('password');
    }
  }, [currentPassword, form]);

  const applyRandomNickname = async () => {
    const randomNickname = await createRandomNickname();
    if (randomNickname) {
      form.setValue('nickname', randomNickname);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const { nickname, email, password } = data;
    const trimmedNickname = nickname.trim();

    // 이메일 인증 여부 검사
    if (!isVerified) {
      toast.error('⚠️ 이메일 인증을 완료해주세요.');
      return;
    }

    // 닉네임 중복 검사
    const isNicknameExists = await checkUserExists('nickname', trimmedNickname);
    if (isNicknameExists) {
      form.setError('nickname', { message: '이미 존재하는 닉네임입니다.' });
      return;
    }

    executeSignUp({ email, password, nickname });
  };

  return {
    form,
    isLoading,
    isVerified,
    isEmailSent,
    isCodeSent,
    sendVerificationCode,
    verifyEmailCode,
    applyRandomNickname,
    onSubmit,
  };
};

export default useSignupForm;
