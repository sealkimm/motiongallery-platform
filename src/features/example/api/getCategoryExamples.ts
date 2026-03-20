'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EXAMPLE_SELECT } from '@/features/example/constants/exampleSelect';
import { transformExampleData } from '@/features/example/utils';

interface GetExamplesByCategoryProps {
  type: string;
  page: number;
  pageSize: number;
  searchQuery?: string;
}

export const getExamplesByCategory = async ({
  type,
  page,
  pageSize,
  searchQuery,
}: GetExamplesByCategoryProps) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const from = page * pageSize;
  const to = from + pageSize;

  let query = supabase
    .from('examples')
    .select(EXAMPLE_SELECT)
    .eq('type', type);

  // 검색어 있는 경우 검색 조건 추가
  if (searchQuery && searchQuery.trim()) {
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
    );
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`예제 목록을 불러오지 못했습니다: ${error.message}`);
  }

  const pagedData = (data ?? []).slice(0, pageSize);
  const exampleIds = pagedData.map(example => example.id);

  let likedExampleIds: string[] = [];
  let bookmarkedExampleIds: string[] = [];

  if (user?.id && exampleIds.length > 0) {
    const [
      { data: likes, error: likesError },
      { data: bookmarks, error: bookmarksError },
    ] = await Promise.all([
      supabase
        .from('likes')
        .select('example_id')
        .eq('user_id', user.id)
        .in('example_id', exampleIds),
      supabase
        .from('bookmarks')
        .select('example_id')
        .eq('user_id', user.id)
        .in('example_id', exampleIds),
    ]);

    if (likesError || bookmarksError) {
      throw new Error('사용자 상호작용 정보를 불러오지 못했습니다.');
    }

    likedExampleIds = likes?.map(item => item.example_id) ?? [];
    bookmarkedExampleIds = bookmarks?.map(item => item.example_id) ?? [];
  }

  return {
    data: transformExampleData(
      pagedData,
      likedExampleIds,
      bookmarkedExampleIds,
    ),
    hasMore: (data?.length ?? 0) > pageSize,
  };
};
