import type { User } from '@/features/auth/types/user';

export interface Example {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  created_by: string;
  created_at: string;
  thumbnail: string;
  tags?: string[];
}

export interface ExampleAuthor {
  id: User['id'];
  nickname: User['nickname'];
  avatar_url: User['avatar_url'];
}

export interface ExampleCardData {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  thumbnail: string;
  author: ExampleAuthor;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface ExampleDetails extends Example {
  author: ExampleAuthor;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface HomeExampleRow {
  id: string;
  type: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  created_at: string;
  author_id: User['id'];
  author_nickname: User['nickname'];
  author_avatar_url: User['avatar_url'];
  like_count: number;
  comment_count: number;
}

export interface RawExample extends Example {
  author: ExampleAuthor | ExampleAuthor[];
  comment_count?: number;
  like_count?: number;
}
