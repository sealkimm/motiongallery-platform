import type { MouseEventHandler } from 'react';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';

interface ExampleCardActionsProps {
  handleLike: MouseEventHandler<HTMLButtonElement>;
  handleBookmark: MouseEventHandler<HTMLButtonElement>;
  handleComment?: MouseEventHandler<HTMLButtonElement>;
  commentCount?: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  showComment?: boolean;
  iconSize?: number;
}

const ExampleCardActions = ({
  handleLike,
  handleBookmark,
  handleComment,
  commentCount,
  likeCount,
  isLiked,
  isBookmarked,
  showComment = true,
  iconSize = 16,
}: ExampleCardActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={handleLike}
        aria-label={isLiked ? `좋아요 취소, 현재 ${likeCount}개` : `좋아요, 현재 ${likeCount}개`}
        className="flex items-center gap-1 p-1 text-gray-400 transition-colors hover:text-red-500"
      >
        <Heart
          size={iconSize}
          className={isLiked ? 'fill-red-500 text-red-500' : ''}
        />
        {showComment && <span className="text-sm">{likeCount}</span>}
      </button>
      {showComment && (
        <button
          type="button"
          onClick={handleComment}
          aria-label={`댓글 ${commentCount ?? 0}개 보기`}
          className="flex items-center gap-1 p-1 text-gray-400 transition-colors hover:text-blue-500"
        >
          <MessageCircle size={iconSize} />
          <span className="text-sm">{commentCount}</span>
        </button>
      )}
      <button
        type="button"
        onClick={handleBookmark}
        aria-label={isBookmarked ? '북마크 취소' : '북마크 추가'}
        className="flex items-center gap-1 p-1 text-gray-400 transition-colors hover:text-yellow-500"
      >
        <Bookmark
          size={iconSize}
          className={isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}
        />
      </button>
    </div>
  );
};

export default ExampleCardActions;
