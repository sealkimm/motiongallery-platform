/**
 * @description 이메일 인증을 위한 커스텀 훅
 *
 * @param {UseFormReturn<FormValues>} form - 폼 데이터
 *
 * @returns {boolean} isEmailSent - 이메일 전송 여부
 * @returns {boolean} isVerified - 이메일 인증 여부
 * @returns {boolean} isCodeSent - 인증번호 전송 여부
 * @returns {function} sendVerificationCode - 인증번호 전송 함수
 * @returns {function} verifyEmailCode - 이메일 인증 함수
 */

'use client';

import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase/client';
import { checkUserExists } from '@/features/auth/api/checkUserExists';
import type { FormValues } from '@/features/auth/formSchema';

import useSupabaseRequest from './useSupabaseRequest';

interface VerifyCodeParams {
  email: string;
  code: string;
}

const useEmailVerification = (form: UseFormReturn<FormValues>) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const { execute: executeVerifyCode } =
    //타입 정의 하는데가 있고 안하는데가 있다. 확인
    useSupabaseRequest<VerifyCodeParams, unknown>({
      requestFn: async ({ email, code }) => {
        const { data, error } = await supabase
          .from('verification_codes')
          .select('*')
          .eq('email', email)
          .eq('code', code)
          .maybeSingle();
        return { data, error };
      },
      onSuccess: () => {
        setIsVerified(true);
        form.clearErrors('verifyCode');
        toast.success('✅ 이메일 인증이 완료되었습니다.');
      },
      onError: error => {
        console.error('인증번호 일치 실패', error);
        form.setError('verifyCode', {
          message: '인증번호가 일치하지 않습니다.',
        });
      },
    });

  const sendVerificationCode = async () => {
    const email = form.getValues('email');
    const trimmedEmail = email.trim();

    // 이메일 유효성 검사
    const isValid = await form.trigger('email');
    if (!isValid) return;

    // 이메일 중복 검사
    const isEmailExists = await checkUserExists('email', email);
    if (isEmailExists) {
      form.setError('email', { message: '이미 존재하는 이메일입니다.' });
      return;
    }

    try {
      setIsCodeSent(true);

      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) throw new Error('이메일 전송 실패');

      toast.success('인증번호가 이메일로 전송되었습니다.');
      setIsEmailSent(true);
    } catch (error) {
      toast.error('❌ 이메일 전송에 실패했습니다.');
    } finally {
      setIsCodeSent(false);
    }
  };

  const verifyEmailCode = async () => {
    const email = form.getValues('email');
    const code = form.getValues('verifyCode');

    if (!code) {
      form.setError('verifyCode', { message: '인증번호를 입력해주세요.' });
      return;
    }

    executeVerifyCode({ email, code });
  };

  return {
    isEmailSent,
    isVerified,
    isCodeSent,
    sendVerificationCode,
    verifyEmailCode,
  };
};

export default useEmailVerification;
