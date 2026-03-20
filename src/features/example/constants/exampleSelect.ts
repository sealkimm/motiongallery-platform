export const EXAMPLE_SELECT = `
  id,
  type,
  title,
  description,
  thumbnail,
  created_at,
  created_by,
  tags,
  comment_count,
  like_count,
  author:users(id, nickname, avatar_url)
`;
