/**!!!!!!!!!!!!!!!!!!!!!다시다시닷디사시
 * @description Supabase API 요청을 처리하는 커스텀 훅
 *
 * @param {useSupabaseRequestProps<TVars, TResult>} props - 요청 함수, 성공 콜백, 실패 콜백
 *
 * @returns {object} execute - 요청 함수
 * @returns {boolean} isLoading - 로딩 상태
 * @returns {TResult | null} data - 응답 데이터
 * @returns {PostgrestError | Error | null} error - 에러 객체
 */

'use client';

//!!!!!!!!!!!! 이해하기 중용한 부분임!!!!!!!
// any 쓴거 수정해야함
import { useCallback, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

type RequestFn<TVars, TResult> = (vars: TVars) => Promise<{
  data: TResult | null;
  error: PostgrestError | Error | null;
}>;

interface useSupabaseRequestProps<TVars, TResult> {
  requestFn: RequestFn<TVars, TResult>;
  onSuccess?: (data: TResult, vars: TVars) => void;
  onError?: (error: PostgrestError | Error, vars: TVars) => void;
}

const useSupabaseRequest = <TVars, TResult>({
  requestFn,
  onSuccess,
  onError,
}: useSupabaseRequestProps<TVars, TResult>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<PostgrestError | Error | null>(null);

  const execute = useCallback(
    async (vars: TVars) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: result, error: supabaseError } = await requestFn(vars);

        if (supabaseError) {
          console.error('[SupabaseRequest Error]', supabaseError);

          setError(supabaseError);
          onError?.(supabaseError, vars);
          return;
        }

        if (result) {
          setData(result);
          onSuccess?.(result, vars);
        } else {
          const notFoundError = new Error('No data');

          setError(notFoundError);
          onError?.(notFoundError, vars);
          return;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('[SupabaseRequest Error]', error);

        setError(error);
        onError?.(error, vars);
      } finally {
        setIsLoading(false);
      }
    },
    [requestFn, onSuccess, onError],
  );

  return { execute, isLoading, data, error };
};

export default useSupabaseRequest;
