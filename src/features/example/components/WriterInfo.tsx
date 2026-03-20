import { UserIcon } from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/features/auth/types/user';

interface WriterInfoProps {
  author: Pick<User, 'nickname' | 'avatar_url'>;
  createdAt?: string;
  variant?: 'card' | 'full';
}

const WriterInfo = ({
  variant = 'full',
  author,
  createdAt,
}: WriterInfoProps) => {
  const isFull = variant === 'full';

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-gray-800',
        // isFull ? 'mb-6 border-b pb-6' : 'mt-3 border-t pt-4',
        isFull ? '' : 'mt-3 border-t pt-4', // 확인하기!!!!!!!!!!!!!!!
      )}
    >
      <Avatar
        className={cn(
          'border-2 border-purple-500/50',
          isFull ? 'h-10 w-10' : 'h-8 w-8',
        )}
      >
        <AvatarImage src={author.avatar_url} alt={author.nickname} />
        <AvatarFallback>
          <UserIcon size={16} />
        </AvatarFallback>
      </Avatar>
      <div>
        <p
          className={cn(
            'font-medium',
            isFull ? 'text-base' : 'text-sm text-gray-100',
          )}
        >
          {author.nickname}
        </p>
        {isFull && createdAt && (
          <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>
        )}
      </div>
    </div>
  );
};

export default WriterInfo;
