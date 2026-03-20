import { categories } from '@/features/category/data/categories';

import type {
  ExampleCardData,
  ExampleAuthor,
  HomeExampleRow,
  RawExample,
} from '../types/example';

export const normalizeExampleAuthor = (
  author: RawExample['author'],
): ExampleAuthor => {
  return Array.isArray(author) ? author[0] : author;
};

export const transformExampleData = (
  data: Array<Omit<RawExample, 'content'>>,
  likedExampleIds: string[] = [],
  bookmarkedExampleIds: string[] = [],
): ExampleCardData[] => {
  const likedExampleIdSet = new Set(likedExampleIds);
  const bookmarkedExampleIdSet = new Set(bookmarkedExampleIds);

  const result = data.map(
    ({ author, comment_count, like_count, ...item }) => ({
      ...item,
      author: normalizeExampleAuthor(author),
      commentCount: comment_count ?? 0,
      likeCount: like_count ?? 0,
      isLiked: likedExampleIdSet.has(item.id),
      isBookmarked: bookmarkedExampleIdSet.has(item.id),
    }),
  );
  return result;
};

export const transformHomeExampleData = (
  data: HomeExampleRow[],
  likedExampleIds: string[],
  bookmarkedExampleIds: string[],
): ExampleCardData[] => {
  return data.map(item => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description ?? '',
    created_at: item.created_at,
    thumbnail: item.thumbnail ?? '',
    author: {
      id: item.author_id,
      nickname: item.author_nickname,
      avatar_url: item.author_avatar_url,
    },
    commentCount: item.comment_count ?? 0,
    likeCount: item.like_count ?? 0,
    isLiked: likedExampleIds.includes(item.id),
    isBookmarked: bookmarkedExampleIds.includes(item.id),
  }));
};

export const groupExamplesByCategory = (examples: ExampleCardData[]) => {
  const result = categories
    .map(category => {
      const categoryExamples = examples.filter(
        example => example.type === category.type,
      );
      return {
        ...category,
        examples: categoryExamples,
      };
    })
    .filter(category => category.examples.length > 0);
  return result;
};
