import Link from 'next/link';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { User } from '@/features/auth/types/user';

import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
}

const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`${user.nickname} 메뉴 열기`}
          className="flex items-center gap-4"
        >
          <Avatar className="h-8 w-8 border-2 border-purple-500">
            <AvatarImage src={user.avatar_url} alt={user.nickname} />
            <AvatarFallback>
              <UserIcon size={16} />
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm md:block">{user.nickname}</span>
          <ChevronDown size={16} aria-hidden="true" className="hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 border-gray-800 bg-gray-900">
        <DropdownMenuItem asChild>
          <Link
            href="/mypage"
            className="flex cursor-pointer items-center gap-4"
          >
            <UserIcon size={16} />
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onSignOut}
          className="flex cursor-pointer items-center gap-4"
        >
          <LogOut size={16} />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
