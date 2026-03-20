/**
 * @description 댓글 CRUD 기능을 제공하는 커스텀 훅
 *
 * @param {string} exampleId - 댓글이 달린 예제 ID
 * @param {CommentWithUser[]} initialComments - 초기 댓글 목록
 * @param {string} [userId] - 현재 로그인한 사용자 ID
 *
 * @returns {CommentWithUser[]} comments - 댓글 목록
 * @returns {boolean} isCreating - 댓글 생성 중 여부
 * @returns {boolean} isUpdating - 댓글 수정 중 여부
 * @returns {boolean} isDeleting - 댓글 삭제 중 여부
 * @returns {function} handleCreateComment - 댓글 생성 함수
 * @returns {function} handleUpdateComment - 댓글 수정 함수
 * @returns {function} handleDeleteComment - 댓글 삭제 함수
 */

'use client';

import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase/client';
import {
  normalizeComment,
  type CommentWithUser,
  type RawCommentWithUser,
} from '@/features/comment/types/comment';

import useSupabaseRequest from './useSupabaseRequest';

interface UseCommentProps {
  exampleId: string;
  userId?: string;
  setComments: Dispatch<SetStateAction<CommentWithUser[]>>;
  setTotalCount: Dispatch<SetStateAction<number>>;
}

const MAX_COMMENT_LENGTH = 300;

const useComment = ({
  exampleId,
  userId,
  setComments,
  setTotalCount,
}: UseCommentProps) => {
  // 생성
  const { execute: createComment, isLoading: isCreating } = useSupabaseRequest({
    requestFn: async ({
      content,
      exampleId,
      userId,
      parentId,
    }: {
      content: string;
      exampleId: string;
      userId: string;
      parentId?: string;
    }) => {
      const result = await supabase
        .from('comments')
        .insert({
          content,
          example_id: exampleId,
          user_id: userId,
          parent_id: parentId || null,
        })
        .select('*, author:users(id, nickname, avatar_url)')
        .single();
      return {
        ...result,
        data: result.data ? normalizeComment(result.data as RawCommentWithUser) : null,
      };
    },
    onSuccess: result => {
      setComments(prev => [result, ...prev]);
      setTotalCount(prev => prev + 1);
    },
  });

  // 수정
  const { execute: updateComment, isLoading: isUpdating } = useSupabaseRequest({
    requestFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const result = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .select('*, author:users(id, nickname, avatar_url)')
        .single();
      return {
        ...result,
        data: result.data ? normalizeComment(result.data as RawCommentWithUser) : null,
      };
    },
    onSuccess: result => {
      if (!result) return;

      setComments(prev =>
        prev.map(comment => (comment.id === result.id ? result : comment)),
      );
    },
  });

  // 삭제
  const { execute: deleteComment, isLoading: isDeleting } = useSupabaseRequest({
    requestFn: async ({ commentId }: { commentId: string }) => {
      const result = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .select()
        .single();
      return result;
    },
    onSuccess: result => {
      if (!result) return;

      setComments(prev => prev.filter(comment => comment.id !== result.id));
      setTotalCount(prev => Math.max(0, prev - 1));
    },
  });

  const validateComment = (content: string) => {
    const trimmed = content.trim();
    if (trimmed.length === 0) {
      toast.error('댓글을 최소 1자 이상 입력해주세요.');
      return false;
    }
    if (trimmed.length > MAX_COMMENT_LENGTH) {
      toast.error(
        `댓글은 최대 ${MAX_COMMENT_LENGTH}자까지만 입력할 수 있습니다.`,
      );
      return false;
    }
    return true;
  };

  const handleCreateComment = (content: string, parentId?: string) => {
    if (!userId) {
      toast.error('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }
    if (!validateComment(content)) return;
    createComment({ content, exampleId, userId, parentId });
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    if (!validateComment(content)) return false;
    updateComment({ commentId, content });
    return true;
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment({ commentId });
  };

  return {
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};
export default useComment;
