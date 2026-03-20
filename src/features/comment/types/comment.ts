import type { User } from '@/features/auth/types/user';

export interface Comment {
  id: string;
  content: string;
  example_id: string;
  user_id: string;
  parent_id?: string;
  created_at: string;
  replies?: CommentWithUser[];
}

export interface CommentAuthor
  extends Pick<User, 'id' | 'nickname' | 'avatar_url'> {}

export interface CommentWithUser extends Comment {
  author: CommentAuthor;
}

export interface RawCommentWithUser extends Comment {
  author: CommentAuthor | CommentAuthor[];
}

export const normalizeCommentAuthor = (
  author: RawCommentWithUser['author'],
): CommentAuthor => {
  return Array.isArray(author) ? author[0] : author;
};

export const normalizeComment = (
  comment: RawCommentWithUser,
): CommentWithUser => {
  return {
    ...comment,
    author: normalizeCommentAuthor(comment.author),
  };
};
