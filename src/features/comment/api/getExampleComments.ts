'use server';

import { normalizeComment, type RawCommentWithUser } from '@/features/comment/types/comment';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface GetExampleCommentsProps {
  id: string;
  page: number;
  pageSize: number;
}

export const getExampleComments = async ({
  id,
  page,
  pageSize,
}: GetExampleCommentsProps) => {
  const supabase = await createSupabaseServerClient();

  const from = page * pageSize;
  const to = from + pageSize;

  const { data, error } = await supabase
    .from('comments')
    .select('id, content, example_id, user_id, parent_id, created_at, author:users(id, nickname, avatar_url)')
    .eq('example_id', id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`댓글을 불러오지 못했습니다: ${error.message}`);

  const pagedData = ((data ?? []) as RawCommentWithUser[])
    .slice(0, pageSize)
    .map(normalizeComment);

  return {
    data: pagedData,
    hasMore: (data?.length ?? 0) > pageSize,
    totalCount: pagedData.length,
  };
};
