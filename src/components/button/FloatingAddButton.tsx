'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const FloatingAddButton = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    router.push('/write');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="floating-add-button-enter">
        <Button
          onClick={handleClick}
          aria-label={user ? '새 글 작성' : '로그인 후 새 글 작성'}
          className="gradient-background h-14 w-14 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
};

export default FloatingAddButton;
