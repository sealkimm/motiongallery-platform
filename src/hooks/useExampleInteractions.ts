/**
 * @description 예제 상세 페이지에서 사용자 상호작용(좋아요, 북마크)을 처리하는 커스텀 훅
 *
 * @param {UseExampleInteractionsProps} example - 예제 데이터
 *
 * @returns {function} handleLike - 좋아요 처리 함수
 * @returns {function} handleBookmark - 북마크 처리 함수
 * @returns {number} likeCount - 좋아요 수
 * @returns {boolean} isLiked - 좋아요 여부
 * @returns {boolean} isBookmarked - 북마크 여부
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase/client';
import type { ExampleDetails } from '@/features/example/types/example';

interface UseExampleInteractionsProps {
  example: Pick<
    ExampleDetails,
    'id' | 'likeCount' | 'isLiked' | 'isBookmarked'
  >;
}

const useExampleInteractions = ({ example }: UseExampleInteractionsProps) => {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(example.likeCount);
  const [isLiked, setIsLiked] = useState(example.isLiked ?? false);
  const [isBookmarked, setIsBookmarked] = useState(
    example.isBookmarked ?? false,
  );

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('example_id', example.id);
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      await supabase.from('likes').insert({
        user_id: user.id,
        example_id: example.id,
      });
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (isBookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('example_id', example.id);
      setIsBookmarked(false);
    } else {
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        example_id: example.id,
      });
      setIsBookmarked(true);
    }
  };
  return { handleLike, handleBookmark, likeCount, isLiked, isBookmarked };
};

export default useExampleInteractions;
