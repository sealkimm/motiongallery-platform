'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  transformHomeExampleData,
  groupExamplesByCategory,
} from '@/features/example/utils';

import type { HomeExampleRow } from '../types/example';

const HOME_EXAMPLE_LIMIT = 4;

export const getHomeExamples = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc('get_home_examples', {
    limit_per_type: HOME_EXAMPLE_LIMIT,
  });

  if (error) {
    throw new Error(`메인 예제 목록을 불러오지 못했습니다: ${error.message}`);
  }

  const homeExamples = (data ?? []) as HomeExampleRow[];
  const exampleIds = homeExamples.map(example => example.id);

  if (!user?.id || exampleIds.length === 0) {
    return groupExamplesByCategory(
      transformHomeExampleData(homeExamples, [], []),
    );
  }

  const [{ data: likes, error: likesError }, { data: bookmarks, error: bookmarksError }] =
    await Promise.all([
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

  const likedExampleIds = likes?.map(item => item.example_id) ?? [];
  const bookmarkedExampleIds = bookmarks?.map(item => item.example_id) ?? [];

  return groupExamplesByCategory(
    transformHomeExampleData(
      homeExamples,
      likedExampleIds,
      bookmarkedExampleIds,
    ),
  );
};
