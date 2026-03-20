import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// markdown editor에서 허용 투명 제거
export const removeAllowTransparency = (value: string) => {
  return value
    .replace(/\s*allowtransparency\s*(=\s*(['"])?.*?\2)?/gi, '')
    .replace(/\s*allowTransparency\s*(=\s*(['"])?.*?\2)?/g, '');
};

// markdown preview에서 실행 불가능한 script 태그를 제거
export const removeScriptTags = (value: string) => {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '');
};

export const sanitizeMarkdownContent = (value: string) => {
  return removeScriptTags(removeAllowTransparency(value));
};

// 예제 썸네일 추출 (코드펜, 코드샌드박스만 있음)
export const extractThumbnailUrl = (content: string) => {
  const match = content.match(/<iframe[^>]+src="([^"]+)"[^>]*>/);
  if (!match) return '/default-thumbnail.png';

  const src = match[1];

  if (src.includes('codepen.io')) {
    const parts = src.match(/codepen\.io\/([^/]+)\/embed\/([^?]+)/);
    return `https://shots.codepen.io/${parts?.[1]}/pen/${parts?.[2]}-1280.jpg`;
  }

  if (src.includes('codesandbox.io')) {
    const parts = src.match(/codesandbox\.io\/embed\/([^?/]+)/);
    return `https://codesandbox.io/api/v1/sandboxes/${parts?.[1]}/screenshot.png`;
  }

  return '/default-thumbnail.png';
};

// 날짜 포맷팅
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const formattedDate = date.toLocaleDateString();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formattedDate;
};
