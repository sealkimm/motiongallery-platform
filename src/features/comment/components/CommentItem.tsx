'use client';

import { useState } from 'react';
import {
  ChevronDown,
  CornerDownRight,
  Edit,
  MessageCircle,
  MoreVertical,
  Trash,
  UserIcon,
} from 'lucide-react';

import { formatDate } from '@/lib/utils';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { CommentWithUser } from '../types/comment';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: CommentWithUser;
  userId?: string;
  replies?: CommentWithUser[];
  onCreate?: (content: string, parentId: string) => void;
  onUpdate: (commentId: string, content: string) => boolean;
  onDelete: (commentId: string) => void;
  isCreating?: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const REPLY_PAGE_SIZE = 5;

const CommentItem = ({
  comment,
  userId,
  replies = [],
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: CommentItemProps) => {
  const isAuthor = comment.author.id === userId;
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [visibleRepliesCount, setVisibleRepliesCount] =
    useState(REPLY_PAGE_SIZE);
  const hasReplies = replies.length > 0;
  const hasMoreReplies = replies.length > visibleRepliesCount;

  const isReply = !!comment.parent_id;

  const handleUpdate = (content: string) => {
    const success = onUpdate(comment.id, content);
    if (!success) return;
    setIsEditMode(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleReply = (content: string) => {
    if (onCreate) {
      onCreate(content, comment.id);
      setIsReplyMode(false);
    }
  };

  const handleLoadMoreReplies = () => {
    setVisibleRepliesCount(prev => prev + REPLY_PAGE_SIZE);
  };

  return (
    <div className="relative flex w-full items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={comment.author.avatar_url}
          alt={comment.author.nickname}
        />
        <AvatarFallback>
          <UserIcon size={16} />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {comment.author.nickname}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              {formatDate(comment.created_at)}
            </span>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="댓글 옵션 열기"
                  className="h-6 w-6 focus-visible:ring-0"
                  disabled={isUpdating || isDeleting}
                >
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-gray-800 bg-gray-900"
              >
                <DropdownMenuItem
                  onClick={() => setIsEditMode(true)}
                  className="cursor-pointer"
                >
                  <Edit size={14} className="mr-2" /> 수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="cursor-pointer text-red-500"
                >
                  <Trash size={14} className="mr-2" /> 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {isEditMode ? (
          <CommentForm
            initialContent={comment.content}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditMode(false)}
            isLoading={isUpdating}
            isEditMode={isEditMode}
            isReply={isReply}
          />
        ) : (
          <>
            <p className="mb-2 break-words break-all pr-8 text-sm text-gray-300">
              {comment.content}
            </p>
            {!isReply && (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setIsReplyMode(!isReplyMode);
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  <MessageCircle size={14} className="mr-1" />
                  답글
                </Button>
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setShowReplies(!showReplies);
                    }}
                    className="text-xs text-[rgb(84_139_209)] hover:text-[rgb(84_139_209)]"
                  >
                    <ChevronDown size={14} /> 답글 {replies.length}개
                  </Button>
                )}
              </div>
            )}
          </>
        )}
        {isReplyMode && (
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setIsReplyMode(false)}
            isReply={true}
            isLoading={isCreating || false}
            className="mb-0 mt-3"
          />
        )}
        {showReplies && hasReplies && (
          <div className="ml-12 mt-4 flex flex-col items-start gap-4">
            {replies.slice(0, visibleRepliesCount).map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                userId={userId}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
            {hasMoreReplies && (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleLoadMoreReplies}
                className="gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                <CornerDownRight size={14} />
                답글 더보기
              </Button>
            )}
          </div>
        )}
      </div>
      {/* 글작성 삭제는 해당 ui가 버튼 그룹에 있음.. 맞나?? 위치 둘 다 확인하기 */}
      <DeleteConfirmDialog
        type="comment"
        onDelete={handleDelete}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};
export default CommentItem;
